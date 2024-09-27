import { Body, Controller, Get, Post, Req, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SettingsResponse, UserResponse } from './response';
import { AuthGuard } from '@nestjs/passport';
import { CompressionInterceptor } from '../../common/interceptors/compressionInterceptor';
import { DecompressPipe } from '../../common/pipes/decompressPipe';
import { ChangeMainDataDto, ChangeSkillsDataDto } from './dto';

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

	@ApiTags('USER')
	@UseGuards(AuthGuard('jwt'))
	@UsePipes(new ValidationPipe())
	@UsePipes(DecompressPipe)
	@UseInterceptors(CompressionInterceptor)
	@ApiResponse({ status: 200, type: UserResponse })
	@Post('changeMainData')
	async changeMainData(@Req() req, @Body() dto: ChangeMainDataDto): Promise<UserResponse> {
		return this.userService.changeMainData(req.user.id, dto);
	}

	@ApiTags('USER')
	@UseGuards(AuthGuard('jwt'))
	@UsePipes(new ValidationPipe())
	@UsePipes(DecompressPipe)
	@UseInterceptors(CompressionInterceptor)
	@ApiResponse({ status: 200, type: UserResponse })
	@Post('changeSkills')
	async changeSkills(@Req() req, @Body() dto: ChangeSkillsDataDto): Promise<UserResponse> {
		return this.userService.changeSkills(req.user.id, dto);
	}
}
