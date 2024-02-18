import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { PrismaService } from '../../prisma.service';
import { hash } from 'argon2';
import { User } from '@prisma/client';
import { UserResponse } from './response';

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
					email: true,
				},
			});
		} catch (e) {
			throw new Error(e);
		}
	}
}
