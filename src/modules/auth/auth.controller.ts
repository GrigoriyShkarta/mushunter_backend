import { Controller, Post, Body, UsePipes, Headers, ValidationPipe, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Email, EmailWidthLang, UserLoginDto, UserRegisterDto } from './dto';
import { AuthResponse } from './response';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DecompressPipe } from '../../common/interceptors/decompressionInterceptor';
import { CompressionInterceptor } from '../../common/interceptors/compressionInterceptor';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	@ApiTags('AUTH')
	@UsePipes(new ValidationPipe())
	@UsePipes(DecompressPipe)
	@UseInterceptors(CompressionInterceptor)
	@ApiResponse({ status: 201, type: AuthResponse })
	@Post('register')
	register(@Body() dto: UserRegisterDto, @Headers('accept-language') lang: string): Promise<AuthResponse> {
		return this.authService.register({ email: dto.email, firstname: dto.firstname, lastname: dto.lastname, lang });
	}

	@ApiTags('AUTH')
	@UsePipes(new ValidationPipe())
	@UsePipes(DecompressPipe)
	@UseInterceptors(CompressionInterceptor)
	@ApiResponse({ status: 200, type: AuthResponse })
	@Post('login')
	async login(@Body() dto: Email, @Headers('accept-language') lang: string): Promise<AuthResponse> {
		return this.authService.login({ email: dto.email, lang });
	}

	@ApiTags('AUTH')
	@UsePipes(new ValidationPipe())
	@UsePipes(DecompressPipe)
	@UseInterceptors(CompressionInterceptor)
	@ApiResponse({ status: 200, type: AuthResponse })
	@Post('socialAuth')
	async socialAuth(@Body() dto: Email, @Headers('accept-language') lang: string): Promise<boolean | AuthResponse> {
		return this.authService.socialMediaAuth({ email: dto.email, lang });
	}

	@ApiTags('AUTH')
	@UsePipes(new ValidationPipe())
	@UsePipes(DecompressPipe)
	@UseInterceptors(CompressionInterceptor)
	@ApiResponse({ status: 200 })
	@Post('checkEmail')
	async checkEmail(@Body() dto: Email, @Headers('accept-language') lang: string): Promise<boolean> {
		return this.authService.checkEmail({ email: dto.email, lang });
	}
}
