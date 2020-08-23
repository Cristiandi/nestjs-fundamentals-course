import { Module, DynamicModule } from '@nestjs/common';
import { createConnection, ConnectionOptions } from 'typeorm';

// Initial attempt at creating "CONNECTION" provider, and utilizing useValue for values */
@Module({})
// Creating static register() method on DatabaseModule
export class DatabaseModule {
  static register(options: ConnectionOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'CONNECTION', // 👈
          useValue: createConnection(options), 
        }
      ]
    }
  }
}