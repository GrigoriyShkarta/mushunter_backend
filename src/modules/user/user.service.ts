import { Injectable } from '@nestjs/common';
import { CreateUserDto, FindUserDto } from './dto';
import { PrismaService } from '../../prisma.service';
import { SettingsResponse, UserResponse } from './response';
import { I18nService } from 'nestjs-i18n';
import { translateField, formatSkills, formatStyles, includeUserRelations } from './utils/user.utils';

@Injectable()
export class UserService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly i18n: I18nService,
	) {}

	async findUserByEmail(dto: FindUserDto): Promise<UserResponse> {
		const user = await this.prisma.user.findUnique({
			where: { email: dto.email },
			include: includeUserRelations,
		});

		return user ? this.formatUser(user) : null;
	}

	async createUser(dto: CreateUserDto): Promise<UserResponse> {
		const user = await this.prisma.user.create({
			data: {
				firstname: dto.firstname,
				lastname: dto.lastname,
				email: dto.email,
			},
			include: includeUserRelations,
		});

		return this.formatUser(user);
	}

	async getUser(id: number): Promise<UserResponse> {
		const user = await this.prisma.user.findUnique({
			where: { id },
			include: includeUserRelations,
		});

		if (!user) {
			throw new Error(`User with id ${id} not found`);
		}

		return this.formatUser(user);
	}

	async getSettings(): Promise<SettingsResponse> {
		const cities = await this.prisma.city.findMany({
			select: {
				id: true,
				name: true,
			},
		});
		const styles = await this.prisma.style.findMany({
			select: {
				id: true,
				name: true,
			},
		});
		const skills = await this.prisma.skill.findMany({
			select: {
				id: true,
				name: true,
			},
		});

		const translateItems = (items: any[], type: string) => {
			return items.map((item) => ({
				id: item.id,
				name: {
					en: translateField(this.i18n, `${type}.${item.name}`, 'en'),
					ua: translateField(this.i18n, `${type}.${item.name}`, 'ua'),
				},
			}));
		};

		return {
			styles,
			cities: translateItems(cities, 'city'),
			skills: translateItems(skills, 'skill'),
		};
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
			city: translatedCityName,
			skills: formatSkills(this.i18n, user?.skills ?? []),
			links: user?.links ?? [],
			styles: formatStyles(user?.styles ?? []),
		};
	}
}
