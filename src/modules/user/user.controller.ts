import { Controller, Get, Req, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SettingsResponse, UserResponse } from './response';
import { AuthGuard } from '@nestjs/passport';
import { CompressionInterceptor } from '../../common/interceptors/compressionInterceptor';
import { DecompressPipe } from '../../common/pipes/decompressPipe';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiTags('USER')
	@UseGuards(AuthGuard('jwt'))
	@UseInterceptors(CompressionInterceptor)
	@UsePipes(DecompressPipe)
	@ApiResponse({ status: 200, type: UserResponse })
	@Get('me')
	async getProfile(@Req() req): Promise<UserResponse> {
		return this.userService.getUser(req.user.id);
	}

	@ApiTags('USER')
	@UseGuards(AuthGuard('jwt'))
	@UseInterceptors(CompressionInterceptor)
	@UsePipes(DecompressPipe)
	@ApiResponse({ status: 200, type: SettingsResponse })
	@Get('settings')
	async getSettings(): Promise<SettingsResponse> {
		return this.userService.getSettings();
	}
}
