import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { TokenModule } from '../token/token.module';
import { UserService } from '../user/user.service';
import { PrismaService } from '../../prisma.service';
import { GoogleStrategy } from './google.strategy';

@Module({
	imports: [UserModule, TokenModule],
	controllers: [AuthController],
	providers: [AuthService, UserService, PrismaService, GoogleStrategy],
})
export class AuthModule {}
