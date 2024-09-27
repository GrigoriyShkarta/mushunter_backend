import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

import { TokenModule } from './modules/token/token.module';

import configuration from './config/global.config';
import { AcceptLanguageResolver, HeaderResolver, I18nJsonLoader, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import * as express from 'express';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CompressionInterceptor } from './common/interceptors/compressionInterceptor';

@Module({
	imports: [
		I18nModule.forRoot({
			fallbackLanguage: 'ua',
			loader: I18nJsonLoader,
			loaderOptions: {
				path: path.join(__dirname, '/i18n/'),
				watch: true,
			},
			resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver, new HeaderResolver(['x-lang'])],
		}),
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration],
		}),
		AuthModule,
		UserModule,
		TokenModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		PrismaService,
		// {
		// 	provide: APP_INTERCEPTOR,
		// 	useClass: CompressionInterceptor,
		// },
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(express.raw({ type: 'application/octet-stream' })).forRoutes('*');
	}
}
