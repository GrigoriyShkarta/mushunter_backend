import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDate, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

class TranslatedObj {
	@ApiProperty()
	@IsString()
	ua: string;

	@ApiProperty()
	@IsString()
	en: string;
}

export class City {
	@ApiProperty()
	@IsNumber()
	id: number;

	@ApiProperty()
	name: TranslatedObj;
}

export class UserResponse {
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
	@IsOptional()
	@IsDate()
	birthday: Date;

	@ApiProperty()
	@IsOptional()
	@IsString()
	description: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	education: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	phone: string;

	@ApiProperty()
	@IsOptional()
	@IsNumber()
	likes: number;

	@ApiProperty()
	@IsOptional()
	city: City;

	@ApiProperty()
	@IsOptional()
	skills: Skills[];

	@ApiProperty()
	@IsOptional()
	styles: Styles[];

	@ApiProperty()
	@IsOptional()
	@IsArray()
	links: string[];

	@ApiProperty()
	@IsBoolean()
	hasLiked: boolean;

	@ApiProperty()
	@IsBoolean()
	isLookingForBand: boolean;

	@ApiProperty()
	@IsBoolean()
	isOpenToOffers: boolean;

	@ApiProperty()
	@IsArray()
	lookingForSkills: GetSkills[];

	@ApiProperty()
	@IsUrl()
	avatar: string;

	@ApiProperty()
	@IsArray()
	groups: Group[];
}

export class SettingsResponse {
	@ApiProperty()
	cities: City[];

	@ApiProperty()
	skills: GetSkills[];

	@ApiProperty()
	styles: Styles[];
}

export class GetSkills {
	@ApiProperty()
	@IsNumber()
	id: number;

	@ApiProperty()
	name: TranslatedObj;
}

export class Skills {
	@ApiProperty()
	@IsNumber()
	id: number;

	@ApiProperty()
	name: TranslatedObj;

	@ApiProperty()
	@IsNumber()
	experience: number;

	@ApiProperty()
	@IsOptional()
	@IsString()
	description: string;
}

export class Styles {
	@ApiProperty()
	@IsNumber()
	id: number;

	@ApiProperty()
	@IsString()
	name: string;
}

export class Group {
	@ApiProperty()
	@IsNumber()
	id: number;

	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsString()
	avatar: string;

	@ApiProperty()
	@IsArray()
	skills: GroupSkill[];
}

export class GroupSkill {
	@ApiProperty()
	@IsNumber()
	id: number;

	@ApiProperty()
	name: TranslatedObj;
}
