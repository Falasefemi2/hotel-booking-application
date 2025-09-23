import { Test, TestingModule } from '@nestjs/testing';
import { BookedroomController } from './bookedroom.controller';

describe('BookedroomController', () => {
  let controller: BookedroomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookedroomController],
    }).compile();

    controller = module.get<BookedroomController>(BookedroomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
