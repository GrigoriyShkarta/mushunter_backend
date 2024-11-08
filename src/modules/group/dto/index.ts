import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsOptional()
	@IsDate()
	creationDate: Date;

	@ApiProperty()
	@IsOptional()
	@IsString()
	description: string;

	@ApiProperty()
	@IsOptional()
	@IsNumber()
	city: number;

	@ApiProperty()
	@IsOptional()
	@IsArray()
	styles: number[];

	@ApiProperty()
	@IsOptional()
	@IsArray()
	links: string[];
}

export class ChangeMainData {
	@ApiProperty()
	@IsNumber()
	id: number;

	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsOptional()
	@IsDate()
	birthday: Date;

	@ApiProperty()
	@IsOptional()
	@IsString()
	description: string;

	@ApiProperty()
	@IsOptional()
	@IsNumber()
	city: number;

	@ApiProperty()
	@IsOptional()
	@IsArray()
	styles: number[];

	@ApiProperty()
	@IsOptional()
	@IsArray()
	links: string[];
}
