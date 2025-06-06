import { createWinstonLogger } from '@app/common';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { MsProductServiceModule } from './ms-product-service.module';

async function bootstrap() {
  const winstonLogger = createWinstonLogger('ms-client-service');

  const app = await NestFactory.createMicroservice(MsProductServiceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue:
        process.env.RABBITMQ_QUEUE_MS_PRODUCT_SERVICE ||
        'product_service_queue',
      queueOptions: {
        durable: true,
      },
    },
    logger: winstonLogger,
  });
  const logger = new Logger('MS-Product-Service');

  await app.listen();
  logger.log('🟡 MS-Product-Service is listening for messages...');
  logger.log('📂 Logs: ./logs/ms-product-service.log');
}
bootstrap();
