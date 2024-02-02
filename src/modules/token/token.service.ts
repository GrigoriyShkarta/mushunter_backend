import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AppError } from '../../common/constants/error';
import { PrismaService } from '../../prisma.service';
import { Tokens, RefreshTokensResponse } from './response';

@Injectable()
export class TokenService {
	constructor(
		private jwt: JwtService,
		private readonly configService: ConfigService,
		private readonly prisma: PrismaService,
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
			const user = await this.prisma.user.findUnique({
				where: { id: result.id },
				select: {
					id: true,
					firstname: true,
					lastname: true,
					email: true,
				},
			});
			const tokens = this.issueTokens(user.id);
			return { user, tokens };
		} catch (e) {
			throw new Error(e);
		}
	}
}
