import { Injectable } from '@nestjs/common';
import { CoffeesService } from 'src/coffees/coffees.service';

@Injectable()
export class CoffeRatingService {
  constructor(private readonly coffeesService: CoffeesService) {}
}
