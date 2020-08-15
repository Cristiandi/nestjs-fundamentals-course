import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Shipwreck roast',
      brand: 'Buddy Brew',
      flavors: ['chocolate', 'vanilla']
    }
  ];

  findAll(): Coffee[] {
    return this.coffees;
  }

  findOne(id: string) {
    const existingCoffee = this.coffees.find(item => item.id === +id);
    
    if (!existingCoffee) {
      throw new NotFoundException(`coffee ${id} not found`);
    }

    return existingCoffee
  }

  create(createCoffeeDto: any): void {
    const temp = [...this.coffees, createCoffeeDto];
    this.coffees = temp;
    return createCoffeeDto;
  }

  update(id: string, updateCoffeeDto: any): void {
    const existingCoffee = this.findOne(id);
    if (existingCoffee) {
      const updatedCoffee = {
        ...existingCoffee,
        ...updateCoffeeDto
      };

      const index = this.coffees.findIndex(item => item.id === existingCoffee.id);

      if (index < 0) return;

      this.coffees[index] = updatedCoffee;
    }
  }


  remove(id: string) {
    const coffeeIndex = this.coffees.findIndex(item => item.id === +id);
    if (coffeeIndex >= 0) {
      this.coffees.splice(coffeeIndex, 1);
    }
  }
}
