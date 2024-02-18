import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CheckEmail, UserLoginDto, UserRegisterDto } from './dto';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { AppError } from '../../common/constants/error';
import { verify } from 'argon2';
import { AuthResponse, CheckEmailResponse } from './response';
import { UserResponse } from '../user/response';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly tokenService: TokenService,
		private readonly mailService: MailerService,
		private readonly prisma: PrismaService,
	) {}
	async register(dto: UserRegisterDto): Promise<AuthResponse> {
		try {
			const validateUser = await this.validateRegisterUser(dto);
			if (validateUser) {
				const user = await this.userService.createUser(dto);
				const tokens = this.tokenService.issueTokens(user.id);
				await this.prisma.tempAuthData.delete({
					where: { email: dto.email },
				});
				return { user, tokens };
			}
		} catch (e) {
			console.error(e);
			throw e;
		}
	}

	async login(dto: UserLoginDto): Promise<AuthResponse> {
		try {
			const user = await this.validateLoginUser(dto);
			const tokens = this.tokenService.issueTokens(user.id);
			return { user, tokens };
		} catch (e) {
			console.error(e);
			throw e;
		}
	}

	private async validateLoginUser(dto: UserLoginDto): Promise<UserResponse> {
		const user = await this.userService.findUserByEmail(dto.email);
		if (!user) throw new NotFoundException(AppError.USER_LOGIN_ERROR);
		const isValid = await verify(user.password, dto.password);
		if (!isValid) throw new UnauthorizedException(AppError.USER_LOGIN_ERROR);
		return user;
	}

	private async validateRegisterUser(dto: UserRegisterDto): Promise<boolean> {
		const existTempUser = await this.prisma.tempAuthData.findUnique({
			where: {
				email: dto.email,
			},
		});
		const checkTempToken = existTempUser.tempToken === dto.tempToken;
		if (!checkTempToken) throw new UnauthorizedException(AppError.TOKEN_HAS_EXPIRED);
		const isTokenExpired = await this.tokenService.isTokenExpired(dto.tempToken);
		if (isTokenExpired) throw new UnauthorizedException(AppError.TOKEN_HAS_EXPIRED);
		const checkPassword = existTempUser.tempPassword === dto.tempPassword;
		if (!checkPassword) throw new UnauthorizedException(AppError.INVALID_TEMP_PASSWORD);
		return true;
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
		const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';

		let password = '';
		for (let i = 0; i < 6; i++) {
			const randomIndex = Math.floor(Math.random() * charset.length);
			password += charset[randomIndex];
		}

		return password;
	}

	async sendTempPasswordMail(dto: UserRegisterDto): Promise<string> {
		try {
			const existUser = await this.userService.findUserByEmail(dto.email);
			if (existUser) throw new BadRequestException(AppError.USER_EXIST);
			const tempPassword = await this.createTempUser(dto);
			await this.sendEmail({
				email: dto.email,
				subject: 'Temporary password',
				text: `Your temporary password - ${tempPassword}`,
			});
			return this.tokenService.generateTempToken(dto.email);
		} catch (e) {
			console.error(e);
			throw e;
		}
	}

	private async createTempUser(dto: UserRegisterDto): Promise<string> {
		try {
			const existTempUser = await this.prisma.tempAuthData.findUnique({
				where: { email: dto.email },
			});
			if (existTempUser) {
				await this.prisma.tempAuthData.delete({
					where: { email: dto.email },
				});
			}
			const tempPassword = this.generateRandomPassword();
			await this.prisma.tempAuthData.create({
				data: {
					firstname: dto.firstname,
					lastname: dto.lastname,
					email: dto.email,
					tempToken: dto.tempToken,
					password: dto.password,
					tempPassword,
				},
			});
			return tempPassword;
		} catch (e) {
			console.error(e);
		}
	}

	async forgotPassword(email: string): Promise<CheckEmailResponse> {
		try {
			const existUser = await this.userService.findUserByEmail(email);
			if (!existUser) throw new NotFoundException(AppError.USER_NOT_FOUND);
			const token = this.tokenService.generateTempToken(email);
			await this.sendEmail({
				email,
				subject: 'Password Reset',
				text: `Click the following link to reset your password: http://localhost:3000/reset-password?token=${token}`,
			});
			return { sendMail: true };
		} catch (e) {
			console.error(e);
			throw e;
		}
	}

	private async sendEmail(mailOption: any): Promise<void> {
		try {
			await this.mailService.sendMail({
				to: mailOption.email,
				from: 'mushuntermail@gmail.com',
				subject: mailOption.subject,
				text: mailOption.text,
			});
		} catch (e) {
			console.error(e);
		}
	}
}
