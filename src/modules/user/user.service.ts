import { Injectable } from '@nestjs/common';
import { CreateUserDto, FindUserDto } from './dto';
import { PrismaService } from '../../prisma.service';
import { UserResponse } from './response';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class UserService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly i18n: I18nService,
	) {}

	async findUserByEmail(dto: FindUserDto): Promise<UserResponse> {
		try {
			const user = await this.prisma.user.findUnique({
				where: { email: dto.email },
				include: {
					city: {
						select: {
							id: true,
							name: true,
						},
					},
					skills: {
						include: {
							skill: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
				},
			});
			return this.formatUser(user, dto.lang);
		} catch (e) {
			throw new Error(e);
		}
	}

	async createUser(dto: CreateUserDto): Promise<UserResponse> {
		try {
			const user = await this.prisma.user.create({
				data: {
					firstname: dto.firstname,
					lastname: dto.lastname,
					email: dto.email,
				},
				include: {
					city: true,
					skills: {
						include: {
							skill: true,
						},
					},
				},
			});

			return this.formatUser(user, dto.lang);
		} catch (e) {
			throw new Error(`Failed to create user: ${e.message}`);
		}
	}

	async getUser(id: number, lang?: string): Promise<UserResponse> {
		try {
			const user = await this.prisma.user.findUnique({
				where: { id },
				include: {
					city: {
						select: {
							name: true,
						},
					},
					skills: {
						include: {
							skill: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
				},
			});

			if (!user) {
				throw new Error(`User with id ${id} not found`);
			}

			return this.formatUser(user, lang);
		} catch (e) {
			throw new Error(`Error fetching user with id ${id}: ${e.message}`);
		}
	}

	private formatUser(user, lang): UserResponse {
		const translatedCityName = user.city ? this.i18n.t(`translation.city.${user.city.name}`, { lang }) : null;

		return {
			id: user.id,
			firstname: user.firstname,
			lastname: user.lastname,
			birthday: user.birthday,
			description: user.description,
			education: user.education,
			phone: user.phone,
			likes: user.likes,
			city: translatedCityName,
			skills: user.skills
				? user.skills.map((userSkill) => ({
						id: userSkill.skill.id,
						name: userSkill.skill.name,
						experience: userSkill.experience,
					}))
				: [],
		};
	}
}
