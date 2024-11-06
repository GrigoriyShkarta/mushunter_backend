import { Body, Controller, Get, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { isValidDate } from 'rxjs/internal/util/isDate';
import { CompressionInterceptor } from '../../common/interceptors/compressionInterceptor';
import { OptionalJwtAuthGuard } from '../token/optionalGuard';
import { UserResponse } from '../user/response';
import { CreateGroupDto } from './dto';
import { GroupResponse } from './dto/response';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
	constructor(private readonly groupService: GroupService) {}

	@ApiTags('GROUP')
	@UseGuards(AuthGuard('jwt'))
	@UseInterceptors(CompressionInterceptor, FileInterceptor('file'))
	@ApiResponse({ status: 200, type: UserResponse })
	@Post('create')
	async create(@Req() req, @Body() dto: CreateGroupDto, @UploadedFile() file): Promise<UserResponse> {
		const parsedDto = this.parseDto(dto);
		return this.groupService.createGroup(parsedDto, req.user.id, file);
	}

	@ApiTags('GROUP')
	@UseGuards(OptionalJwtAuthGuard)
	@UseInterceptors(CompressionInterceptor)
	@ApiResponse({ status: 200, type: UserResponse })
	@Get('getGroup')
	async getUser(@Req() req, @Query('id') id: string): Promise<GroupResponse> {
		const userId = req.user ? req.user.id : null;
		return this.groupService.getBandById(+id, userId);
	}

	parseDto(dto: Record<string, any>): CreateGroupDto {
		return {
			name: dto.name,
			city: dto.city ? Number(dto.city) : undefined,
			description: dto.description,
			styles: dto.styles ? JSON.parse(dto.styles) : [],
			creationDate: isValidDate(dto.created_date) ? new Date(dto.created_date) : undefined, // Проверяем дату на корректность
			links: dto.links ? JSON.parse(dto.links) : [],
		};
	}
}
