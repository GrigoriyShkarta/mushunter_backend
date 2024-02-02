import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserLoginDto, UserRegisterDto } from './dto';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { AppError } from '../../common/constants/error';
import { verify } from 'argon2';
import { AuthResponse } from './response';
import { UserResponse } from '../user/response';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly tokenService: TokenService,
	) {}
	async register(dto: any): Promise<AuthResponse> {
		try {
			const existUser = await this.userService.findUserByEmail(dto.email);
			if (existUser) throw new BadRequestException(AppError.USER_EXIST);
			const user = await this.userService.createUser(dto);
			const tokens = this.tokenService.issueTokens(user.id);
			return { user, tokens };
		} catch (e) {
			console.error(e);
			throw e;
		}
	}

	async login(dto: UserLoginDto): Promise<AuthResponse> {
		try {
			const user = await this.validateUser(dto);
			const tokens = this.tokenService.issueTokens(user.id);
			return { user, tokens };
		} catch (e) {
			console.error(e);
			throw e;
		}
	}

	private async validateUser(dto: UserLoginDto): Promise<UserResponse> {
		try {
			const user = await this.userService.findUserByEmail(dto.email);
			if (!user) new NotFoundException(AppError.USER_LOGIN_ERROR);
			const isValid = await verify(user.password, dto.password);
			if (!isValid) new UnauthorizedException(AppError.USER_LOGIN_ERROR);
			return user;
		} catch (e) {
			throw new Error(e);
		}
	}

	async googleAuth(dto: any): Promise<AuthResponse> {
		try {
			const existUser = await this.userService.findUserByEmail(dto.emails[0].value);
			if (existUser) {
				const tokens = this.tokenService.issueTokens(existUser.id);
				const user = {
					id: existUser.id,
					email: existUser.email,
					firstname: existUser.firstname,
					lastname: existUser.lastname,
					avatarPath: existUser.avatarPath,
				};
				return { user, tokens };
			} else {
				const newUser = {
					firstname: dto.name.givenName,
					lastname: dto.name.familyName,
					email: dto.emails[0].value,
					password: this.generateRandomPassword(),
				};
				const user = await this.userService.createUser(newUser);
				const tokens = this.tokenService.issueTokens(user.id);
				return { user, tokens };
			}
		} catch (e) {
			console.error(e);
		}
	}

	private generateRandomPassword(): string {
		const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:,.<>?';

		let password = '';
		for (let i = 0; i < 10; i++) {
			const randomIndex = Math.floor(Math.random() * charset.length);
			password += charset[randomIndex];
		}

		return password;
	}
}
