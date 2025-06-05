import { Controller } from '@nestjs/common';
import { MsUserServiceService } from './ms-user-service.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class MsUserServiceController {
  constructor(private readonly msUserServiceService: MsUserServiceService) {}

  @MessagePattern('get_user')
  getUser(data: { id: string }) {
    return this.msUserServiceService.getUser(data.id);
  }

  @MessagePattern('health_user')
  getHealth() {
    return this.msUserServiceService.getHealth();
  }
}
