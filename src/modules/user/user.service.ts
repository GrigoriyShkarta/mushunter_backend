import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { I18nService } from 'nestjs-i18n';
import { FirebaseRepository } from '../../firebase.service';
import { PrismaService } from '../../prisma.service';
import {
	ChangeDescriptionDto,
	ChangeInSearchDataDto,
	ChangeMainDataDto,
	ChangeSkillsDataDto,
	CreateUserDto,
} from './dto';
import { SettingsResponse, UserResponse } from './response';
import {
	formatLookingForSkills,
	formatSkills,
	formatStyles,
	includeUserRelations,
	translateField,
} from './utils/user.utils';

@Injectable()
export class UserService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly i18n: I18nService,
		private readonly firebaseRepository: FirebaseRepository,
	) {}

	async createUser(dto: CreateUserDto): Promise<UserResponse> {
		const user = await this.prisma.user.create({
			data: { ...dto },
			include: includeUserRelations,
		});

		return this.formatUser(user);
	}

	async getUser(id?: number, currentUserId?: number, email?: string): Promise<UserResponse> {
		const user = await this.prisma.user.findUnique({
			where: email ? { email } : { id },
			include: includeUserRelations,
		});

		if (!user) {
			return null;
		}

		const hasLiked = await this.hasLikedUser(currentUserId, user.id);

		const groups = await Promise.all(
			user.groupMemberships.map(async (membership) => {
				const memberRoles = membership.group.members.find((m) => m.userId === user.id)?.role;

				const member = memberRoles
					? formatLookingForSkills(this.i18n, await this.searchLookingSkills(memberRoles.map((role) => role)))
					: [];

				return {
					id: membership.group.id,
					name: membership.group.name,
					avatar: membership.group.avatar ?? '',
					skills: member,
				};
			}),
		);

		const skills = await Promise.all(
			user.skills.map(async (skill) => {
				const styles = await this.searchLookingStyles(skill.styleIds);

				return formatSkills(this.i18n, [skill], styles);
			}),
		);

		const lookingForSkills = await Promise.all(
			user.lookingForSkills.map(async (skill) => {
				const styles = await this.searchLookingStyles(skill.styleIds);
				const age = await this.searchLookingAge([skill.age]);

				return formatSkills(this.i18n, [skill], styles, age[0]);
			}),
		);

		const stylesLookingForBand = await Promise.all(await this.searchLookingStyles(user.stylesLookingForBand));

		const searchSkill = await this.searchLookingSkills(user.position ? [user.position] : []);
		const position = formatLookingForSkills(this.i18n, searchSkill)[0];

		return {
			...this.formatUser(user),
			hasLiked,
			groups,
			skills: skills.flat(),
			lookingForSkills: lookingForSkills.flat(),
			stylesLookingForBand,
			position,
		};
	}

	async getSettings(): Promise<SettingsResponse> {
		const [cities, styles, skills, age] = await Promise.all([
			this.prisma.city.findMany({ select: { id: true, name: true } }),
			this.prisma.style.findMany({ select: { id: true, name: true } }),
			this.prisma.skill.findMany({ select: { id: true, name: true } }),
			this.prisma.age.findMany({ select: { id: true, name: true } }),
		]);

		const translateItems = (items: any[], type: string) =>
			items.map((item) => ({
				id: item.id,
				name: {
					en: translateField(this.i18n, `${type}.${item.name}`, 'en'),
					ua: translateField(this.i18n, `${type}.${item.name}`, 'ua'),
				},
			}));

		return {
			styles,
			cities: translateItems(cities, 'city'),
			skills: translateItems(skills, 'skill'),
			age,
		};
	}

	async changeMainData(id: number, dto: ChangeMainDataDto): Promise<UserResponse> {
		const dataToUpdate = {
			firstname: dto.firstname,
			lastname: dto.lastname,
			birthday: dto.birthday,
			education: dto.education,
			cityId: dto.city,
			phone: dto?.phone,
			links: dto.links,
			isLookingForBand: dto.isLookingForBand,
		};

		await this.prisma.user.update({
			where: { id },
			data: dataToUpdate,
		});

		if (dto.styles) {
			await this.updateUserStyles(id, dto.styles);
		}

		return this.getUser(id);
	}

	async changeSkills(id: number, dto: ChangeSkillsDataDto): Promise<UserResponse> {
		await this.prisma.userSkill.deleteMany({
			where: { userId: id },
		});

		await Promise.all(
			dto.skills.map((skill) => {
				return this.prisma.userSkill.create({
					data: {
						userId: id,
						skillId: skill.skill,
						experience: skill.experience,
						description: skill?.description,
						styleIds: skill.styles,
					},
				});
			}),
		);

		return this.getUser(id);
	}

	async changeInSearch(id: number, dto: ChangeInSearchDataDto): Promise<UserResponse> {
		try {
			await this.prisma.$transaction(async (prisma) => {
				await prisma.user.update({
					where: { id },
					data: {
						isLookingForBand: dto.isLookingForBand,
						position: dto.position,
						descriptionPosition: dto.descriptionPosition,
						stylesLookingForBand: dto.stylesLookingForBand,
					},
				});

				await prisma.userSkillRequirement.deleteMany({
					where: { userId: id },
				});

				await Promise.all(
					dto.skills.map((skill) => {
						return prisma.userSkillRequirement.create({
							data: {
								userId: id,
								skillId: skill.skill,
								experience: skill.experience,
								description: skill?.description,
								styleIds: skill.styles,
								age: skill.age,
							},
						});
					}),
				);
			});

			return this.getUser(id);
		} catch (error) {
			console.error('Error updating search settings', error);
			throw new Error('Failed to update search settings');
		}
	}

	async changeDescription(id: number, dto: ChangeDescriptionDto): Promise<UserResponse> {
		await this.prisma.user.update({
			where: { id },
			data: {
				description: dto.description,
			},
			include: {
				skills: true,
			},
		});
		return this.getUser(id);
	}

	async likeUser(likerId: number, likedId: number): Promise<UserResponse> {
		const existingLike = await this.prisma.likes.findFirst({
			where: {
				likerUserId: likerId,
				likedUserId: likedId,
			},
		});

		if (existingLike) {
			await this.prisma.likes.delete({
				where: { id: existingLike.id },
			});

			await this.prisma.user.update({
				where: { id: likedId },
				data: { likes: { decrement: 1 } },
			});
		} else {
			await this.prisma.likes.create({
				data: {
					likerUserId: likerId,
					likedUserId: likedId,
				},
			});

			await this.prisma.user.update({
				where: { id: likedId },
				data: { likes: { increment: 1 } },
			});
		}

		return this.getUser(likedId, likerId);
	}

	async hasLikedUser(likerId: number, likedId: number): Promise<boolean> {
		if (!likerId) {
			return false;
		}

		const like = await this.prisma.likes.findFirst({
			where: {
				likerUserId: likerId,
				likedUserId: likedId,
			},
		});

		return !!like;
	}

	async changeAvatar(userId: number, file: Express.Multer.File): Promise<UserResponse> {
		const bucket = admin.storage().bucket();

		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: { avatar: true },
		});

		if (user?.avatar) {
			const oldFileNameWithParams = user.avatar.split('/').pop();
			const oldFileName = oldFileNameWithParams?.split('?')[0];
			const oldFileRef = bucket.file(`images/${oldFileName}`);
			try {
				await oldFileRef.delete();
			} catch (error) {
				console.error('Не удалось удалить старый аватар:', error);
			}
		}

		const fileName = `images/${file.originalname}`;
		const fileRef = bucket.file(fileName);

		await fileRef.save(file.buffer, {
			metadata: {
				contentType: file.mimetype,
			},
		});

		const url = await fileRef.getSignedUrl({
			action: 'read',
			expires: '03-01-2500',
		});

		await this.prisma.user.update({
			where: { id: userId },
			data: { avatar: url[0] },
		});

		return this.getUser(userId);
	}

	private searchLookingSkills(skillIds: number[]) {
		console.log('skillIds', skillIds);

		return this.prisma.skill.findMany({
			where: {
				id: {
					in: skillIds,
				},
			},
		});
	}

	private searchLookingStyles(styleIds: number[]) {
		return this.prisma.style.findMany({
			where: {
				id: {
					in: styleIds,
				},
			},
		});
	}

	private searchLookingAge(ageIds: number[]) {
		return this.prisma.age.findMany({
			where: {
				id: {
					in: ageIds,
				},
			},
		});
	}

	private async updateUserStyles(userId: number, styles: number[]): Promise<void> {
		await this.prisma.userStyle.deleteMany({ where: { userId } });

		const userStyles = styles.map((styleId) => ({ userId, styleId }));
		await this.prisma.userStyle.createMany({ data: userStyles });
	}

	private formatUser(user): UserResponse {
		const translatedCityName = user?.city
			? {
					id: user.city.id,
					name: {
						en: translateField(this.i18n, `city.${user.city.name}`, 'en'),
						ua: translateField(this.i18n, `city.${user.city.name}`, 'ua'),
					},
				}
			: undefined;

		return {
			id: user.id,
			firstname: user.firstname,
			lastname: user.lastname,
			birthday: user.birthday ?? undefined,
			description: user.description ?? undefined,
			education: user.education ?? undefined,
			phone: user.phone ?? undefined,
			likes: user.likes,
			hasLiked: user.hasLiked ?? false,
			city: translatedCityName,
			skills: user.skills ?? [],
			links: user?.links ?? [],
			styles: formatStyles(user?.styles ?? []),
			isLookingForBand: user.isLookingForBand ?? false,
			position: user?.poposition ?? undefined,
			stylesLookingForBand: user.stylesLookingForBand ?? [],
			lookingForSkills: user.lookingForSkills ?? [],
			descriptionPosition: user.descriptionPosition ?? undefined,
			avatar: user?.avatar ?? '',
			groups: user?.groupMemberships ?? [],
		};
	}
}
