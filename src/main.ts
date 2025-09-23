import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Hotel Management')
    .setDescription('The Hotel API description')
    .setVersion('1.0')
    .addTag('hotels')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const port = Number(process.env.PORT) || 3000;
  try {
    await app.listen(port);
    console.log(`Listening on port ${port}`);
  } catch (err) {
    // Provide a clearer message when the port is already in use
    if ((err as any)?.code === 'EADDRINUSE') {
      console.error(
        `Port ${port} is already in use. Set a different PORT environment variable or stop the process using that port.`,
      );
      process.exit(1);
    }
    throw err;
  }
}

bootstrap();
