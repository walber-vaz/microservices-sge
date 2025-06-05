import { Test, TestingModule } from '@nestjs/testing';
import { MsUserServiceController } from './ms-user-service.controller';
import { MsUserServiceService } from './ms-user-service.service';

describe('MsUserServiceController', () => {
  let msUserServiceController: MsUserServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MsUserServiceController],
      providers: [MsUserServiceService],
    }).compile();

    msUserServiceController = app.get<MsUserServiceController>(MsUserServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(msUserServiceController.getHello()).toBe('Hello World!');
    });
  });
});
