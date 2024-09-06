import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { SkillsModule } from './modules/skills/skills.module';
import { TokenModule } from './modules/token/token.module';
import { SkillsService } from './skills/skills.service';
import { SkillsController } from './skills/skills.controller';
import configuration from './config/global.config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration],
		}),
		AuthModule,
		SkillsModule,
		UserModule,
		TokenModule,
	],
	controllers: [AppController, SkillsController],
	providers: [AppService, PrismaService, SkillsService],
})
export class AppModule {}
