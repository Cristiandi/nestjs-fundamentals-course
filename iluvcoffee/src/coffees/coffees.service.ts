import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';

import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';

import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: Connection
    ) {}

  findAll(paginationQuery: PaginationQueryDto): Promise<Coffee[]> {
    const { limit = 1, offset = 0 } = paginationQuery;
    return this.coffeeRepository.find({
      relations: ['flavors'],
      take: limit,
      skip: offset
    });
  }

  async findOne(id: string): Promise<Coffee> {
    const existingCoffee = await this.coffeeRepository.findOne(id, { relations: ['flavors'] });
    
    if (!existingCoffee) {
      throw new NotFoundException(`coffee ${id} not found`);
    }

    return existingCoffee
  }

  async create(createCoffeeDto: CreateCoffeeDto): Promise<Coffee> {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
    );

    const created = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors
    });
    return this.coffeeRepository.save(created);
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto): Promise<Coffee> {
    const flavors = updateCoffeeDto.flavors &&
    (await Promise.all(
      updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
    ));
    
    // console.log('flavors', flavors);

    const item = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
      flavors
    });

    if (!item) {
      throw new NotFoundException(`coffee ${id} not found`);
    }

    return this.coffeeRepository.save(item);
  }


  async remove(id: string): Promise<Coffee> {
    const existing = await this.findOne(id);
    return this.coffeeRepository.remove(existing);
  }

  async recommendCoffee (coffee: Coffee) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      coffee.recommendations += 1;

      const recommendEvent = new Event();
      recommendEvent.name = 'recommendCoffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: '' + coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existing = await this.flavorRepository.findOne({ name });

    if (existing) return existing;

    return this.flavorRepository.create({ name });
  }
}
