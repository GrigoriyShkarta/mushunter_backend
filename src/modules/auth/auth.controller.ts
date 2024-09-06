import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Email, UserLoginDto, UserRegisterDto } from './dto';
import { AuthResponse } from './response';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	@ApiTags('AUTH')
	@UsePipes(new ValidationPipe())
	@ApiResponse({ status: 201, type: AuthResponse })
	@Post('register')
	register(@Body() dto: UserRegisterDto): Promise<AuthResponse> {
		return this.authService.register(dto);
	}

	@ApiTags('AUTH')
	@UsePipes(new ValidationPipe())
	@ApiResponse({ status: 200, type: AuthResponse })
	@Post('login')
	async login(@Body() dto: Email): Promise<AuthResponse> {
		return this.authService.login(dto);
	}

	@ApiTags('AUTH')
	@UsePipes(new ValidationPipe())
	@ApiResponse({ status: 200, type: AuthResponse })
	@Post('socialAuth')
	async socialAuth(@Body() dto: Email): Promise<boolean | AuthResponse> {
		return this.authService.socialMediaAuth(dto);
	}

	@ApiTags('AUTH')
	@UsePipes(new ValidationPipe())
	@ApiResponse({ status: 200 })
	@Post('checkEmail')
	async checkEmail(@Body() dto: Email): Promise<boolean> {
		return this.authService.checkEmail(dto);
	}
}
