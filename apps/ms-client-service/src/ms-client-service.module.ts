import { Module } from '@nestjs/common';
import { MsClientServiceController } from './ms-client-service.controller';
import { MsClientServiceService } from './ms-client-service.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
  ],
  controllers: [MsClientServiceController],
  providers: [MsClientServiceService],
})
export class MsClientServiceModule {}
