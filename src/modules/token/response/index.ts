import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserResponse } from '../../user/response';

export class Tokens {
	@ApiProperty()
	@IsString()
	accessToken: string;

	@ApiProperty()
	@IsString()
	refreshToken: string;
}
export class RefreshTokensResponse {
	@ApiProperty()
	user: UserResponse;

	@ApiProperty()
	tokens: Tokens;
}
