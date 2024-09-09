import { Controller, Get, Headers, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponse } from './response';
import { AuthGuard } from '@nestjs/passport';
import { CompressionInterceptor } from '../../common/interceptors/compressionInterceptor';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiTags('USER')
	@UseGuards(AuthGuard('jwt'))
	@UseInterceptors(CompressionInterceptor)
	@ApiResponse({ status: 200, type: UserResponse })
	@Get('me')
	async getProfile(@Req() req, @Headers('accept-language') lang: string): Promise<UserResponse> {
		return this.userService.getUser(req.user.id, lang);
	}
}
