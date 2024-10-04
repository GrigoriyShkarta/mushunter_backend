import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../../prisma.service';
import { JwtStrategy } from '../token/jwt.strategy';

import { I18nModule } from 'nestjs-i18n';

@Module({
	controllers: [UserController],
	providers: [UserService, PrismaService, JwtStrategy],
	// imports: [I18nModule],
})
export class UserModule {}
