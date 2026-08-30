import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalsModule } from './animals/animals.module';
import { dataSourceOptions } from './db/data-source';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), AnimalsModule],
})
export class AppModule {}
