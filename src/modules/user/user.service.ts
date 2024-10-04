import { Injectable, NotFoundException } from '@nestjs/common';
import {
	ChangeDescriptionDto,
	ChangeMainDataDto,
	ChangeSkillsDataDto,
	CreateUserDto,
} from './dto';
import { PrismaService } from '../../prisma.service';
import { SettingsResponse, UserResponse } from './response';
import { I18nService } from 'nestjs-i18n';
import {
	formatLookingForSkills,
	formatSkills,
	formatStyles,
	includeUserRelations,
	translateField,
} from './utils/user.utils';
import { AppError } from '../../common/constants/error';
import { FirebaseRepository } from '../../firebase.service';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
			throw new NotFoundException(AppError.USER_LOGIN_ERROR);
		}

		const hasLiked = await this.hasLikedUser(currentUserId, user.id);
		const lookingForSkills = formatLookingForSkills(
			this.i18n,
			await this.searchLookingSkills(user.lookingForSkills),
		);

		return {
			...this.formatUser(user),
			hasLiked,
			lookingForSkills,
		};
	}

	async getSettings(): Promise<SettingsResponse> {
		const [cities, styles, skills] = await Promise.all([
			this.prisma.city.findMany({ select: { id: true, name: true } }),
			this.prisma.style.findMany({ select: { id: true, name: true } }),
			this.prisma.skill.findMany({ select: { id: true, name: true } }),
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
			isOpenToOffers: dto.isOpenToOffers,
			lookingForSkills: dto.lookingForSkills,
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
				return this.prisma.userSkill.upsert({
					where: {
						userId_skillId: {
							userId: id,
							skillId: skill.skill,
						},
					},
					update: {
						experience: skill.experience,
					},
					create: {
						userId: id,
						skillId: skill.skill,
						experience: skill.experience,
					},
				});
			}),
		);

		return this.getUser(id);
	}

	async changeDescription(id: number, dto: ChangeDescriptionDto): Promise<UserResponse> {
		const user = await this.prisma.user.update({
			where: { id },
			data: {
				description: dto.description,
			},
			include: {
				skills: true,
			},
		});
		return this.formatUser(user);
	}

	async likeUser(likerId: number, likedId: number): Promise<UserResponse> {
		const existingLike = await this.prisma.likes.findUnique({
			where: {
				likerId_likedId: {
					likerId,
					likedId,
				},
			},
		});

		if (existingLike) {
			await this.prisma.likes.delete({
				where: {
					id: existingLike.id,
				},
			});
			await this.prisma.user.update({
				where: { id: likedId },
				data: { likes: { decrement: 1 } },
			});
		} else {
			await this.prisma.likes.create({
				data: {
					likerId,
					likedId,
				},
			});

			await this.prisma.user.update({
				where: { id: likedId },
				data: { likes: { increment: 1 } },
			});
		}

		const updatedUser = await this.prisma.user.findUnique({
			where: { id: likedId },
			include: includeUserRelations,
		});

		const hasLiked = await this.hasLikedUser(likerId, likedId);

		return this.formatUser({ ...updatedUser, hasLiked });
	}

	async hasLikedUser(likerId: number, likedId: number): Promise<boolean> {
		if (!likerId) {
			return false;
		}

		const like = await this.prisma.likes.findUnique({
			where: {
				likerId_likedId: {
					likerId,
					likedId,
				},
			},
		});

		return !!like;
	}

	async changeAvatar(file: Express.Multer.File): Promise<string> {
		const storageRef = ref(storage, `images/${file.originalname}`);

		// Загружаем файл в Firebase Storage
		await uploadBytes(storageRef, file.buffer);

		// Получаем ссылку на файл
		const url = await getDownloadURL(storageRef);

		return url;
	}

	private searchLookingSkills(skillIds: number[]) {
		return this.prisma.skill.findMany({
			where: {
				id: {
					in: skillIds,
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
			skills: formatSkills(this.i18n, user?.skills ?? []),
			links: user?.links ?? [],
			styles: formatStyles(user?.styles ?? []),
			isLookingForBand: user.isLookingForBand ?? false,
			isOpenToOffers: user.isOpenToOffers ?? false,
			lookingForSkills: user.lookingForSkills ?? [],
			avatar: user?.avatar ?? '',
		};
	}
}
