import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MsClientServiceService } from './ms-client-service.service';

@Controller()
export class MsClientServiceController {
  constructor(
    private readonly msClientServiceService: MsClientServiceService,
  ) {}

  @MessagePattern('get_client')
  getClient(data: { id: string }) {
    return this.msClientServiceService.getClient(data.id);
  }

  @MessagePattern('health_client')
  getHealth() {
    return this.msClientServiceService.getHealth();
  }
}
