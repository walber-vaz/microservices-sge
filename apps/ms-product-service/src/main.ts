import { NestFactory } from '@nestjs/core';
import { MsProductServiceModule } from './ms-product-service.module';
import { ConsoleLogger, Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('MS-Product-Service');

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
    logger: new ConsoleLogger({
      colors: true,
      json: true,
    }),
  });

  await app.listen();
  logger.log('🟡 MS-Product-Service is listening for messages...');
}
bootstrap();
