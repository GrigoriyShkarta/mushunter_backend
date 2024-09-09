import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { Email, EmailWidthLang, UserRegisterDto, UserRegisterDtoWidthLang } from './dto';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { AppError } from '../../common/constants/error';
import { verify } from 'argon2';
import { AuthResponse } from './response';
import { UserResponse } from '../user/response';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from '../../prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly tokenService: TokenService,
		private readonly mailService: MailerService,
		private readonly prisma: PrismaService,
		private readonly configService: ConfigService,
	) {}
	async register(dto: UserRegisterDtoWidthLang): Promise<AuthResponse> {
		try {
			const validate = await this.validateRegisterUser({ email: dto.email, lang: dto.lang });
			if (validate) {
				const user = await this.userService.createUser(dto);
				const tokens = this.tokenService.issueTokens(user.id);
				return { user, tokens };
			}
		} catch (e) {
			console.error(e);
			throw e;
		}
	}

	async login(dto: EmailWidthLang): Promise<AuthResponse> {
		try {
			const user = await this.validateLoginUser(dto);
			const tokens = this.tokenService.issueTokens(user.id);
			return { user, tokens };
		} catch (e) {
			console.error(e);
			throw e;
		}
	}

	private async validateLoginUser(dto: EmailWidthLang): Promise<UserResponse> {
		const user = await this.userService.findUserByEmail(dto);
		if (!user) throw new NotFoundException(AppError.USER_LOGIN_ERROR);
		return user;
	}

	private async validateRegisterUser(dto: EmailWidthLang): Promise<boolean> {
		const user = await this.userService.findUserByEmail(dto);
		if (user) {
			throw new ConflictException('User with this email already exists');
		} else {
			return true;
		}
	}

	async socialMediaAuth(dto: EmailWidthLang): Promise<boolean | AuthResponse> {
		try {
			const user = await this.userService.findUserByEmail(dto);
			if (user) {
				const tokens = this.tokenService.issueTokens(user.id);
				return { user, tokens };
			} else {
				return false;
			}
		} catch (e) {
			console.error(e);
		}
	}

	async checkEmail(dto: EmailWidthLang): Promise<boolean> {
		try {
			const user = await this.userService.findUserByEmail(dto);
			return !!user;
		} catch (e) {
			console.error(e);
		}
	}

	private async sendEmail(mailOption: any): Promise<void> {
		try {
			await this.mailService.sendMail({
				to: mailOption.email,
				from: this.configService.get('google_mail'),
				subject: mailOption.subject,
				text: mailOption.text,
			});
		} catch (e) {
			console.error(e);
		}
	}
}
