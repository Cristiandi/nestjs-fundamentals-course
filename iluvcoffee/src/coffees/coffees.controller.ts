import { Controller, Get, Param, Body, Post, Patch, Delete, Query, UsePipes, ValidationPipe, SetMetadata } from '@nestjs/common';

import { CoffeesService } from './coffees.service';


import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

import { Public } from 'src/common/decorators/public.decorator';


@Controller('coffees')
export class CoffeesController {
  constructor(
    private readonly coffeeService: CoffeesService
    ) {
    console.log('CoffeesController instantiated');
  }

  @Public()
  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    
    await new Promise(resolve => setTimeout(resolve, 5000));

    return this.coffeeService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.coffeeService.findOne(''+id);
  }

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto){
    console.log(createCoffeeDto instanceof CreateCoffeeDto);
    return this.coffeeService.create(createCoffeeDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeeService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeeService.remove(id);
  }
}
