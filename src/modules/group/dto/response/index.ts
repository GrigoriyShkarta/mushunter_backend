import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDate, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { City, GetSkills, GroupSkill, Styles } from '../../../user/response';

class Member {
	@ApiProperty()
	@IsNumber()
	id: number;

	@ApiProperty()
	@IsString()
	firstname: string;

	@ApiProperty()
	@IsString()
	lastname: string;

	@ApiProperty()
	@IsString()
	avatar: string;

	@ApiProperty()
	@IsArray()
	role: GroupSkill[];
}

export class GroupResponse {
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
	likes: number;

	@ApiProperty()
	@IsBoolean()
	hasLiked: boolean;

	@ApiProperty()
	@IsOptional()
	city: City;

	@ApiProperty()
	@IsOptional()
	styles: Styles[];

	@ApiProperty()
	@IsOptional()
	@IsArray()
	links: string[];

	@ApiProperty()
	@IsArray()
	lookingForSkills: GetSkills[];

	@ApiProperty()
	@IsUrl()
	avatar: string;

	@ApiProperty()
	@IsArray()
	members: Member[];
}
