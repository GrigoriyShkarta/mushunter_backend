import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../../prisma.service';

@Module({
	controllers: [TokenController],
	providers: [TokenService, JwtService, JwtStrategy, PrismaService],
	exports: [TokenService],
})
export class TokenModule {}
