import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { PrismaService } from '../../prisma.service';
import { hash } from 'argon2';
import { User } from '@prisma/client';
import { UserResponse } from './response';
import { AppError } from '../../common/constants/error';
import { getLogger } from 'nodemailer/lib/shared';

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async findUserByEmail(email: string): Promise<User> {
		try {
			return this.prisma.user.findUnique({
				where: { email },
			});
		} catch (e) {
			throw new Error(e);
		}
	}

	async changePassword(id: number, newPassword: string): Promise<boolean> {
		try {
			const res = await this.prisma.user.update({
				where: { id },
				data: {
					password: await hash(newPassword),
				},
			});

			return !!res;
		} catch (e) {
			throw new Error(e);
		}
	}

	async createUser(dto: CreateUserDto): Promise<UserResponse> {
		try {
			return this.prisma.user.create({
				data: {
					firstname: dto.firstname,
					lastname: dto.lastname,
					email: dto.email,
					password: await hash(dto.password),
				},
				select: {
					id: true,
					firstname: true,
					lastname: true,
					email: false,
				},
			});
		} catch (e) {
			throw new Error(e);
		}
	}
}
