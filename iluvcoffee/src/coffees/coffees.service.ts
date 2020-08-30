import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Connection } from 'mongoose';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';

import { Coffee } from './entities/coffee.entity';
import { Event } from '../events/entities/event.entity';

import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectModel(Coffee.name) private readonly coffeeModel: Model<Coffee>,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) { }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;

    return this.coffeeModel.find().skip(offset).limit(limit).exec();
  }

  async findOne(id: string): Promise<Coffee> {
    const existingCoffee = await this.coffeeModel.findOne({ _id: id }).exec();

    if (!existingCoffee) {
      throw new NotFoundException(`coffee ${id} not found`);
    }

    return existingCoffee
  }

  create(createCoffeeDto: CreateCoffeeDto): Promise<Coffee> {
    const coffee = new this.coffeeModel(createCoffeeDto);
    return coffee.save();
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto): Promise<Coffee> {
    const existingCoffee = await this.coffeeModel
      .findOneAndUpdate(
        { _id: id },
        { $set: updateCoffeeDto },
        { new: true })
      .exec();

    if (!existingCoffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }

    return existingCoffee;
  }


  async remove(id: string): Promise<Coffee> {
    const coffee = await this.findOne(id);
    return coffee.remove();
  }

  async recommendCoffee(coffee: Coffee) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      coffee.recommendations++;

      const recommendEvent = new this.eventModel({
        name: 'recommend_coffe',
        type: 'coffe',
        payload: { coffeId: coffee.id }
      });

      await recommendEvent.save({ session });

      await session.commitTransaction();      
    } catch (error) {
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
  }
}
