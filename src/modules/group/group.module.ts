import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { PrismaService } from '../../prisma.service';
import { UserService } from '../user/user.service';

@Module({
	controllers: [GroupController],
	providers: [GroupService, PrismaService, UserService],
})
export class GroupModule {}
