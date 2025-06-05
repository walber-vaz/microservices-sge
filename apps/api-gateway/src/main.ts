import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('API-Gateway');
  const app = await NestFactory.create(ApiGatewayModule, {
    logger: new ConsoleLogger({
      colors: true,
      json: true,
    }),
  });

  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.setGlobalPrefix(configService.get<string>('API_PREFIX') || 'api');
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN')?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Microservices SGE API')
    .setDescription('Sistema de Gestão Empresarial - API Gateway')
    .setVersion('1.0')
    .addTag('users', 'Operações relacionadas a usuários')
    .addTag('clients', 'Operações relacionadas a clientes')
    .addTag('products', 'Operações relacionadas a produtos')
    .addTag('sales', 'Operações relacionadas a vendas')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: configService.get<string>('RABBITMQ_QUEUE'),
      queueOptions: { durable: true },
    },
  });

  app.enableShutdownHooks();

  const port = configService.get<number>('PORT_API_GATEWAY') || 3000;

  await app.startAllMicroservices();
  await app.listen(port);

  logger.log(`🚀 API Gateway running on: http://localhost:${port}`);
  logger.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
