import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsOptional()
	file: Express.Multer.File;
}
