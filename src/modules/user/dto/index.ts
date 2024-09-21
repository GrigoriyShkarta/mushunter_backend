import { IsArray, IsDate, IsEmail, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

export class ChangeMainDataDto {
	@ApiProperty()
	@IsString()
	firstname: string;

	@ApiProperty()
	@IsString()
	lastname: string;

	@ApiProperty()
	@IsNumber()
	city: number;

	@ApiProperty()
	@IsString()
	education: string;

	@ApiProperty()
	@IsString()
	phone: string;

	@ApiProperty()
	@IsDate()
	birthday: Date;

	@ApiProperty()
	@IsArray()
	styles: number[];

	@ApiProperty()
	@IsArray()
	links: string[];
}
