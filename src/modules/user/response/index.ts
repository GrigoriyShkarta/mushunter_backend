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
	city: TranslatedObj;

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
	skills: Skills[];

	@ApiProperty()
	styles: Styles[];
}

export class City {
	@ApiProperty()
	@IsNumber()
	id: number;

	@ApiProperty()
	@IsString()
	name: string;
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
