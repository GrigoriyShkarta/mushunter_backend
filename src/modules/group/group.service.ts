import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { I18nService } from 'nestjs-i18n';
import { PrismaService } from '../../prisma.service';
import { UserResponse } from '../user/response';
import { UserService } from '../user/user.service';
import { formatLookingForSkills, formatStyles, translateField } from '../user/utils/user.utils';
import { CreateGroupDto } from './dto';
import { GroupResponse } from './dto/response';

@Injectable()
export class GroupService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly user: UserService,
		private readonly i18n: I18nService,
	) {}

	async createGroup(dto: CreateGroupDto, userId: number, avatar?: Express.Multer.File): Promise<UserResponse> {
		const dataToCreate = {
			name: dto.name,
			links: dto.links,
			birthday: dto.creationDate,
			description: dto.description,
			cityId: dto.city,
		};

		const group = await this.prisma.group.create({
			data: {
				...dataToCreate,
				creatorId: userId,
				members: {
					create: [
						{
							userId,
							role: [1],
						},
					],
				},
			},
			include: {
				members: true,
			},
		});

		if (dto.styles) {
			await this.updateGroupStyles(group.id, dto.styles);
		}

		if (avatar) {
			const bucket = admin.storage().bucket();
			const fileName = `images/${avatar?.originalname}`;

			const fileRef = bucket.file(fileName);

			await fileRef.save(avatar?.buffer, {
				metadata: {
					contentType: avatar?.mimetype,
				},
			});

			const url = await fileRef.getSignedUrl({
				action: 'read',
				expires: '03-01-2500',
			});

			await this.prisma.group.update({
				where: { id: group.id },
				data: { avatar: url[0] },
			});
		}

		return this.user.getUser(group.members[0].userId);
	}

	async getBandById(groupId: number, currentUserId?: number): Promise<GroupResponse> {
		const group = await this.prisma.group.findUnique({
			where: { id: groupId },
			include: {
				members: true,
			},
		});

		if (!group) {
			return null;
		}

		const hasLiked = await this.hasLikedBand(currentUserId, group.id);

		const members = await Promise.all(
			group.members.map(async (member) => {
				const user = await this.user.getUser(member.userId);
				const skills = await this.searchLookingSkills(member.role);

				return {
					id: user.id,
					firstname: user.firstname,
					lastname: user.lastname,
					avatar: user.avatar,
					role: formatLookingForSkills(this.i18n, skills),
				};
			}),
		);

		return { ...this.formatGroup(group), hasLiked, members };
	}

	async hasLikedBand(likerId: number, likedId: number): Promise<boolean> {
		if (!likerId) {
			return false;
		}

		const like = await this.prisma.likes.findFirst({
			where: {
				likerUserId: likerId,
				likedGroupId: likedId,
			},
		});

		return !!like;
	}

	private async updateGroupStyles(groupId: number, styles: number[]): Promise<void> {
		await this.prisma.userStyle.deleteMany({ where: { groupId } });

		const userStyles = styles.map((styleId) => ({ groupId, styleId }));
		await this.prisma.userStyle.createMany({ data: userStyles });
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

	private formatGroup(group): GroupResponse {
		const translatedCityName = group?.city
			? {
					id: group.city.id,
					name: {
						en: translateField(this.i18n, `city.${group.city.name}`, 'en'),
						ua: translateField(this.i18n, `city.${group.city.name}`, 'ua'),
					},
				}
			: undefined;

		return {
			id: group.id,
			name: group.name,
			birthday: group.birthday ?? undefined,
			description: group.description ?? undefined,
			likes: group.likes,
			city: translatedCityName,
			links: group?.links ?? [],
			styles: formatStyles(group?.styles ?? []),
			lookingForSkills: group.lookingForSkills ?? [],
			avatar: group?.avatar ?? '',
			members: group.members,
			hasLiked: group?.hasLiked ?? false,
		};
	}
}
