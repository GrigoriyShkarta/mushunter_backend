import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../../prisma.service';
import { UserService } from '../user/user.service';
import { FirebaseModule } from '../../firebase.module';

@Module({
	controllers: [TokenController],
	providers: [TokenService, JwtService, JwtStrategy, PrismaService, UserService],
	exports: [TokenService],
})
export class TokenModule {}
