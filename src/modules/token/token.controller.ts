import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { TokenService } from './token.service';
import { RefreshTokenDto } from './dto';
import { RefreshTokensResponse } from './response';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('token')
export class TokenController {
	constructor(private readonly tokenService: TokenService) {}

	@ApiTags('TOKENS')
	@UsePipes(new ValidationPipe())
	@ApiResponse({ status: 200, type: RefreshTokensResponse })
	@Post('access-token')
	async getNewToken(@Body() dto: RefreshTokenDto): Promise<RefreshTokensResponse> {
		return await this.tokenService.getNewToken(dto.refreshToken);
	}
}
