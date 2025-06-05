import { Module } from '@nestjs/common';
import { MsSalesServiceController } from './ms-sales-service.controller';
import { MsSalesServiceService } from './ms-sales-service.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
  ],
  controllers: [MsSalesServiceController],
  providers: [MsSalesServiceService],
})
export class MsSalesServiceModule {}
