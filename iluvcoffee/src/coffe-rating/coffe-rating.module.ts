import { Module } from '@nestjs/common';
import { CoffeRatingService } from './coffe-rating.service';
import { CoffeesModule } from 'src/coffees/coffees.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    DatabaseModule.register({
      type: 'postgres',
      host: 'localhost',
      username: 'postgres',
      password: 'toor',
      port: 5432
    }),
    CoffeesModule,],
  providers: [CoffeRatingService]
})
export class CoffeRatingModule {}
