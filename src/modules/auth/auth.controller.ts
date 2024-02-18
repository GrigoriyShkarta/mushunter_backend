import { Controller, Post, Body, UsePipes, UseGuards, ValidationPipe, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CheckEmail, UserLoginDto, UserRegisterDto } from './dto';
import { AuthResponse, CheckEmailResponse } from './response';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

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
	async login(@Body() dto: UserLoginDto): Promise<AuthResponse> {
		return this.authService.login(dto);
	}

	@UseGuards(AuthGuard('google'))
	@Get()
	async googleAuth(): Promise<void> {}

	@UseGuards(AuthGuard('google'))
	@Get('google/callback')
	async googleAuthRedirect(@Req() req, @Res() res): Promise<AuthResponse> {
		const response = await this.authService.googleAuth(req.user);
		return res.json(response);
	}

	@Get('sendMail')
	async sendMail(@Body() dto: UserRegisterDto): Promise<string> {
		return this.authService.sendTempPasswordMail(dto);
	}

	@Post('checkEmail')
	async checkEmail(@Body() dto: CheckEmail): Promise<CheckEmailResponse> {
		return this.authService.forgotPassword(dto.email);
	}
}
