import {
	IsArray,
	IsDate,
	IsEmail,
	IsNumber,
	IsString,
	IsOptional,
	IsNotEmpty,
	ValidateNested,
	IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { Skill } from '@prisma/client';

export class CreateUserDto {
	@ApiProperty()
	@IsString()
	firstname: string;

	@ApiProperty()
	@IsString()
	lastname: string;

	@ApiProperty()
	@IsEmail()
	email: string;
}

export class FindUserDto {
	@ApiProperty()
	@IsEmail()
	email: string;
}

export class GetUserDto {
	@ApiProperty()
	@IsNumber()
	id: number;
}

export class ChangeMainDataDto {
	@ApiProperty()
	@IsString()
	firstname: string;

	@ApiProperty()
	@IsString()
	lastname: string;

	@ApiProperty()
	@IsOptional()
	@IsNumber()
	city: number;

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
	@Transform(({ value }) => new Date(value))
	@IsDate()
	birthday: Date;

	@ApiProperty()
	@IsOptional()
	@IsArray()
	styles: number[];

	@ApiProperty()
	@IsOptional()
	@IsArray()
	links: string[];

	@ApiProperty()
	@IsOptional()
	@IsBoolean()
	isLookingForBand: boolean;

	@ApiProperty()
	@IsOptional()
	@IsBoolean()
	isOpenToOffers: boolean;

	@ApiProperty()
	@IsOptional()
	@IsArray()
	lookingForSkills: number[];
}

class SkillDto {
	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	skill: number;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	experience: number;
}

export class ChangeSkillsDataDto {
	@ApiProperty({ type: [SkillDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => SkillDto)
	skills: SkillDto[];
}

export class ChangeDescriptionDto {
	@ApiProperty()
	@IsOptional()
	@IsString()
	description: string;
}

export class ToggleLikeDto {
	@ApiProperty()
	@IsNumber()
	id: number;
}

export class ChangeAvatar {
	@ApiProperty({ type: 'string', format: 'binary' })
	file: Express.Multer.File;
}
