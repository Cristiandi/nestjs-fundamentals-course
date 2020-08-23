import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';


import { CoffeesModule } from './coffees/coffees.module';
import { CoffeRatingModule } from './coffe-rating/coffe-rating.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        synchronize: true
      })
    }),
    ConfigModule.forRoot(),
    CoffeesModule,
    CoffeRatingModule,
    CommonModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
