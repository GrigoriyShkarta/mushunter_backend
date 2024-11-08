import {
	Body,
	Controller,
	Get,
	Post,
	Put,
	Query,
	Req,
	UploadedFile,
	UseGuards,
	UseInterceptors,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompressionInterceptor } from '../../common/interceptors/compressionInterceptor';
import { DecompressPipe } from '../../common/pipes/decompressPipe';
import { OptionalJwtAuthGuard } from '../token/optionalGuard';
import {
	ChangeDescriptionDto,
	ChangeInSearchDataDto,
	ChangeMainDataDto,
	ChangeSkillsDataDto,
	ToggleLikeDto,
} from './dto';
import { SettingsResponse, UserResponse } from './response';
import { UserService } from './user.service';

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
	@UseGuards(OptionalJwtAuthGuard)
	@UseInterceptors(CompressionInterceptor)
	@ApiResponse({ status: 200, type: UserResponse })
	@Get('getUser')
	async getUser(@Req() req, @Query('id') id: string): Promise<UserResponse> {
		const userId = req.user ? req.user.id : null;
		return this.userService.getUser(+id, userId);
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
	@Put('changeMainData')
	async changeMainData(@Req() req, @Body() dto: ChangeMainDataDto): Promise<UserResponse> {
		return this.userService.changeMainData(req.user.id, dto);
	}

	@ApiTags('USER')
	@UseGuards(AuthGuard('jwt'))
	@UsePipes(new ValidationPipe())
	@UsePipes(DecompressPipe)
	@UseInterceptors(CompressionInterceptor)
	@ApiResponse({ status: 200, type: UserResponse })
	@Put('changeSkills')
	async changeSkills(@Req() req, @Body() dto: ChangeSkillsDataDto): Promise<UserResponse> {
		return this.userService.changeSkills(req.user.id, dto);
	}

	@ApiTags('USER')
	@UseGuards(AuthGuard('jwt'))
	@UsePipes(new ValidationPipe())
	@UsePipes(DecompressPipe)
	@UseInterceptors(CompressionInterceptor)
	@ApiResponse({ status: 200, type: UserResponse })
	@Put('changeDescription')
	async changeDescription(@Req() req, @Body() dto: ChangeDescriptionDto): Promise<UserResponse> {
		return this.userService.changeDescription(req.user.id, dto);
	}

	@ApiTags('USER')
	@UseGuards(AuthGuard('jwt'))
	@UsePipes(new ValidationPipe())
	@UsePipes(DecompressPipe)
	@UseInterceptors(CompressionInterceptor)
	@ApiResponse({ status: 200, type: UserResponse })
	@Post('like')
	async toggleLikeUser(@Req() req, @Body() dto: ToggleLikeDto): Promise<UserResponse> {
		return this.userService.likeUser(req.user.id, dto.id);
	}

	@ApiTags('USER')
	@UseGuards(AuthGuard('jwt'))
	@UsePipes(new ValidationPipe())
	@UseInterceptors(CompressionInterceptor)
	@ApiResponse({ status: 200, type: UserResponse })
	@UseInterceptors(FileInterceptor('file'))
	@Put('changeAvatar')
	async changeAvatar(@Req() req, @UploadedFile() file: Express.Multer.File): Promise<UserResponse> {
		return this.userService.changeAvatar(req.user.id, file);
	}

	@ApiTags('USER')
	@UseGuards(AuthGuard('jwt'))
	@UsePipes(new ValidationPipe())
	@UsePipes(DecompressPipe)
	@UseInterceptors(CompressionInterceptor)
	@ApiResponse({ status: 200, type: UserResponse })
	@Put('changeInSearch')
	async changeInSearch(@Req() req, @Body() dto: ChangeInSearchDataDto): Promise<UserResponse> {
		return this.userService.changeInSearch(req.user.id, dto);
	}
}
