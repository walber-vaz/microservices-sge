import { Module } from '@nestjs/common';
import { MsUserServiceController } from './ms-user-service.controller';
import { MsUserServiceService } from './ms-user-service.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
  ],
  controllers: [MsUserServiceController],
  providers: [MsUserServiceService],
})
export class MsUserServiceModule {}
