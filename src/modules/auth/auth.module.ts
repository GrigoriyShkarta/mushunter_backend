import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { TokenModule } from '../token/token.module';
import { UserService } from '../user/user.service';
import { PrismaService } from '../../prisma.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import * as process from 'process';
import { I18nModule } from 'nestjs-i18n';

@Module({
	imports: [
		MailerModule.forRoot({
			transport: {
				host: process.env.GOOGLE_HOST,
				auth: {
					user: process.env.GOOGLE_MAIL,
					pass: process.env.GOOGLE_PASSWORD,
				},
			},
		}),
		UserModule,
		TokenModule,
	],
	controllers: [AuthController],
	providers: [AuthService, UserService, PrismaService],
})
export class AuthModule {}
