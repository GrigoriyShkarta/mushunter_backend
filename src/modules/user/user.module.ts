import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../../prisma.service';
import { TokenModule } from '../token/token.module';

@Module({
	controllers: [UserController],
	providers: [UserService, PrismaService],
})
export class UserModule {}
