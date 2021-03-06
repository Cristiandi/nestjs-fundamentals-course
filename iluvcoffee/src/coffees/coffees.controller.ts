import { Controller, Get, Param, Body, Post, Patch, Delete, Query, UsePipes, ValidationPipe, SetMetadata } from '@nestjs/common';

import { CoffeesService } from './coffees.service';


import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

import { Public } from '../common/decorators/public.decorator';
import { Protocol } from '../common/decorators/protocol.decorator';

import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('coffees')
@Controller('coffees')
export class CoffeesController {
  constructor(
    private readonly coffeeService: CoffeesService
    ) {
    console.log('CoffeesController instantiated');
  }

  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Public()
  @Get()
  async findAll(
    @Protocol('https') protocol: string,
    @Query() paginationQuery: PaginationQueryDto
  ) {
    console.log('protocol', protocol);
    const { limit, offset } = paginationQuery;
    
    // this wil throw an error by the timeout interceptor
    // await new Promise(resolve => setTimeout(resolve, 5000));

    return this.coffeeService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    console.log('id', id);
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
