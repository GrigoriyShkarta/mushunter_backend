import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterDto {
	@ApiProperty()
	@IsString()
	firstname: string;

	@ApiProperty()
	@IsString()
	lastname: string;

	@ApiProperty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@MinLength(6, { message: 'Password must be at least 6 characters long' })
	@IsString()
	password: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	tempToken: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	tempPassword: string;
}

export class UserLoginDto {
	@ApiProperty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@MinLength(6, { message: 'Password must be at least 6 characters long' })
	@IsString()
	password: string;
}

export class CheckEmail {
	@ApiProperty()
	@IsEmail()
	email: string;
}
