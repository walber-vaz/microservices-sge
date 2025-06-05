import { Test, TestingModule } from '@nestjs/testing';
import { MsClientServiceController } from './ms-client-service.controller';
import { MsClientServiceService } from './ms-client-service.service';

describe('MsClientServiceController', () => {
  let msClientServiceController: MsClientServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MsClientServiceController],
      providers: [MsClientServiceService],
    }).compile();

    msClientServiceController = app.get<MsClientServiceController>(MsClientServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(msClientServiceController.getHello()).toBe('Hello World!');
    });
  });
});
