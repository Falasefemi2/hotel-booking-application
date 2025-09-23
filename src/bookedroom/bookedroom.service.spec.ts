import { Test, TestingModule } from '@nestjs/testing';
import { BookedroomService } from './bookedroom.service';

describe('BookedroomService', () => {
  let service: BookedroomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookedroomService],
    }).compile();

    service = module.get<BookedroomService>(BookedroomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
