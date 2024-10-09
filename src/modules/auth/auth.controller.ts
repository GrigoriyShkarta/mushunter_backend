import { Controller, Post, Body, UsePipes, Headers, ValidationPipe, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Email, UserRegisterDto } from './dto';
import { AuthResponse } from './response';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompressionInterceptor } from '../../common/interceptors/compressionInterceptor';
import { DecompressPipe } from '../../common/pipes/decompressPipe';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	@ApiTags('AUTH')
	@UsePipes(new ValidationPipe())
	@UsePipes(DecompressPipe)
	@UseInterceptors(CompressionInterceptor)
	@ApiResponse({ status: 201, type: AuthResponse })
	@Post('register')
	register(@Body() dto: UserRegisterDto): Promise<AuthResponse> {
		return this.authService.register({
			email: dto.email,
			firstname: dto.firstname,
			lastname: dto.lastname,
			avatar: dto.avatar,
		});
	}

	@ApiTags('AUTH')
	@UsePipes(new ValidationPipe())
	@UsePipes(DecompressPipe)
	@UseInterceptors(CompressionInterceptor)
	@ApiResponse({ status: 200, type: AuthResponse })
	@Post('login')
	async login(@Body() dto: Email): Promise<AuthResponse> {
		return this.authService.login({ email: dto.email });
	}

	@ApiTags('AUTH')
	@UsePipes(new ValidationPipe())
	@UsePipes(DecompressPipe)
	@UseInterceptors(CompressionInterceptor)
	@ApiResponse({ status: 200, type: AuthResponse })
	@Post('socialAuth')
	async socialAuth(@Body() dto: Email): Promise<boolean | AuthResponse> {
		return this.authService.socialMediaAuth({ email: dto.email });
	}

	@ApiTags('AUTH')
	@UsePipes(new ValidationPipe())
	@UsePipes(DecompressPipe)
	@UseInterceptors(CompressionInterceptor)
	@ApiResponse({ status: 200 })
	@Post('checkEmail')
	async checkEmail(@Body() dto: Email): Promise<boolean> {
		return this.authService.checkEmail({ email: dto.email });
	}
}
