import { Controller, Post, Body, UsePipes, UseGuards, ValidationPipe, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePassword, CheckEmail, CheckTempPassword, UserLoginDto, UserRegisterDto } from './dto';
import { AuthResponse } from './response';
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

	@Post('sendMail')
	async sendMail(@Body() dto: UserRegisterDto): Promise<string> {
		return this.authService.sendTempPasswordMail(dto);
	}
	@UsePipes(new ValidationPipe())
	@Post('forgotPassword')
	async forgotPassword(@Body() dto: CheckEmail): Promise<string> {
		return this.authService.forgotPassword(dto.email);
	}

	@UsePipes(new ValidationPipe())
	@Post('checkTempPassword')
	async checkTempPassword(@Body() dto: CheckTempPassword): Promise<boolean> {
		return this.authService.checkTempPassword(dto);
	}

	@UsePipes(new ValidationPipe())
	@Post('changePassword')
	async changePassword(@Body() dto: ChangePassword): Promise<boolean> {
		return this.authService.changePassword(dto);
	}
}
