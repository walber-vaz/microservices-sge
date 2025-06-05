import { Module } from '@nestjs/common';
import { MsProductServiceController } from './ms-product-service.controller';
import { MsProductServiceService } from './ms-product-service.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
  ],
  controllers: [MsProductServiceController],
  providers: [MsProductServiceService],
})
export class MsProductServiceModule {}
