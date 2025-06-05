import { Module, NotFoundException } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    ClientsModule.registerAsync([
      {
        name: 'MS_USER_SERVICE',
        useFactory: (configService: ConfigService) => {
          const url = configService.get<string>('RABBITMQ_URL');
          const queue = configService.get<string>(
            'RABBITMQ_QUEUE_MS_USER_SERVICE',
          );
          if (!url) throw new NotFoundException('RABBITMQ_URL is not defined');
          if (!queue)
            throw new NotFoundException(
              'RABBITMQ_QUEUE_MS_USER_SERVICE is not defined',
            );
          return {
            transport: Transport.RMQ,
            options: {
              urls: [url],
              queue: queue,
              queueOptions: { durable: true },
            },
          };
        },
        inject: [ConfigService],
      },
      {
        name: 'MS_PRODUCT_SERVICE',
        useFactory: (configService: ConfigService) => {
          const url = configService.get<string>('RABBITMQ_URL');
          const queue = configService.get<string>(
            'RABBITMQ_QUEUE_MS_PRODUCT_SERVICE',
          );
          if (!url) throw new NotFoundException('RABBITMQ_URL is not defined');
          if (!queue)
            throw new NotFoundException(
              'RABBITMQ_QUEUE_MS_PRODUCT_SERVICE is not defined',
            );
          return {
            transport: Transport.RMQ,
            options: {
              urls: [url],
              queue: queue,
              queueOptions: { durable: true },
            },
          };
        },
        inject: [ConfigService],
      },
      {
        name: 'MS_CLIENT_SERVICE',
        useFactory: (configService: ConfigService) => {
          const url = configService.get<string>('RABBITMQ_URL');
          const queue = configService.get<string>(
            'RABBITMQ_QUEUE_MS_CLIENT_SERVICE',
          );
          if (!url) throw new NotFoundException('RABBITMQ_URL is not defined');
          if (!queue)
            throw new NotFoundException(
              'RABBITMQ_QUEUE_MS_CLIENT_SERVICE is not defined',
            );
          return {
            transport: Transport.RMQ,
            options: {
              urls: [url],
              queue: queue,
              queueOptions: { durable: true },
            },
          };
        },
        inject: [ConfigService],
      },
      {
        name: 'MS_SALES_SERVICE',
        useFactory: (configService: ConfigService) => {
          const url = configService.get<string>('RABBITMQ_URL');
          const queue = configService.get<string>(
            'RABBITMQ_QUEUE_MS_SALES_SERVICE',
          );
          if (!url) throw new NotFoundException('RABBITMQ_URL is not defined');
          if (!queue)
            throw new NotFoundException(
              'RABBITMQ_QUEUE_MS_SALES_SERVICE is not defined',
            );
          return {
            transport: Transport.RMQ,
            options: {
              urls: [url],
              queue: queue,
              queueOptions: { durable: true },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
