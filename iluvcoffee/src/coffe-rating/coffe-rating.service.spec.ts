import { Test, TestingModule } from '@nestjs/testing';
import { CoffeRatingService } from './coffe-rating.service';

describe('CoffeRatingService', () => {
  let service: CoffeRatingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoffeRatingService],
    }).compile();

    service = module.get<CoffeRatingService>(CoffeRatingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
