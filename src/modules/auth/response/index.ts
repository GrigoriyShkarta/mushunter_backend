import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from '../../user/response';
import { Tokens } from '../../token/response';

export class AuthResponse {
	@ApiProperty()
	user: UserResponse;

	@ApiProperty()
	tokens: Tokens;
}
