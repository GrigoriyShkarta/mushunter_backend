import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AppError } from '../../common/constants/error';
import { RefreshTokensResponse, Tokens } from './response';
import { UserService } from '../user/user.service';

@Injectable()
export class TokenService {
	constructor(
		private jwt: JwtService,
		private readonly configService: ConfigService,
		private readonly user: UserService,
	) {}
	issueTokens(userId: number): Tokens {
		const data = { id: userId };
		const accessToken = this.jwt.sign(data, {
			secret: this.configService.get('jwt_key'),
			expiresIn: '1h',
		});

		const refreshToken = this.jwt.sign(data, {
			secret: this.configService.get('jwt_key'),
			expiresIn: '7d',
		});

		return { accessToken, refreshToken };
	}

	async getNewToken(refreshToken: string): Promise<RefreshTokensResponse> {
		try {
			const result = await this.jwt.verifyAsync(refreshToken, {
				secret: this.configService.get('jwt_key'),
			});
			if (!result) throw new UnauthorizedException(AppError.INVALID_REFRESH_TOKEN);
			const user = await this.user.getUser(result.id);
			const tokens = this.issueTokens(user.id);
			return { user, tokens };
		} catch (e) {
			if (e.name === 'TokenExpiredError') {
				throw new UnauthorizedException('Refresh token has expired. Please re-authenticate.');
			} else {
				throw new Error(e.message);
			}
		}
	}

	generateTempToken(id: number): string {
		const data = { id };
		try {
			return this.jwt.sign(data, {
				secret: this.configService.get('jwt_key'),
				expiresIn: '1h',
			});
		} catch (e) {
			console.error(e);
		}
	}

	async isTokenExpired(token: string): Promise<boolean> {
		try {
			await this.jwt.verifyAsync(token);
			return false;
		} catch (error) {
			return error.name === 'TokenExpiredError';
		}
	}

	async decodeToken(token: string): Promise<any> {
		return await this.jwt.verify(token, {
			secret: this.configService.get('jwt_key'),
		});
	}
}
