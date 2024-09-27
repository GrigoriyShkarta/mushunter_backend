import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	const prismaService = app.get(PrismaService);
	await prismaService.enableShutdownHooks(app);

	app.enableCors({
		origin: 'http://localhost:5173',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	});

	// app.useGlobalPipes(
	// 	new ValidationPipe({
	// 		transform: true,
	// 	}),
	// );

	const config = new DocumentBuilder()
		.setTitle('MusHunter api')
		.setDescription('This api for lesson')
		.setVersion('1.0')
		.addTag('TAG')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('doc', app, document);
	await app.listen(configService.get<number>('PORT') || 4200);
}
bootstrap();
