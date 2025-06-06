import { createWinstonLogger, LoggingInterceptor } from '@app/common';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { MsClientServiceModule } from './ms-client-service.module';

async function bootstrap() {
  const winstonLogger = createWinstonLogger('ms-client-service');

  const app = await NestFactory.createMicroservice(MsClientServiceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue:
        process.env.RABBITMQ_QUEUE_MS_CLIENT_SERVICE || 'client_service_queue',
      queueOptions: {
        durable: true,
      },
    },
    logger: winstonLogger,
  });
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableShutdownHooks();

  const logger = new Logger('MS-Client-Service');

  await app.listen();
  logger.log('🔵 MS-Client-Service is listening for messages...');
  logger.log('📂 Logs: ./logs/ms-client-service.log');
}
bootstrap();
