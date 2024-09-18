import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

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
	birthday: string;

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
	links: string[];
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
}

export class Styles {
	@ApiProperty()
	@IsNumber()
	id: number;

	@ApiProperty()
	@IsString()
	name: string;
}
