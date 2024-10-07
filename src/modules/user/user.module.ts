import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../../prisma.service';
import { JwtStrategy } from '../token/jwt.strategy';

import { FirebaseModule } from '../../firebase.module';

@Module({
	controllers: [UserController],
	providers: [UserService, PrismaService, JwtStrategy],
	imports: [FirebaseModule],
})
export class UserModule {}
