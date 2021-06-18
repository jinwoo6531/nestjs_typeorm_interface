import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresRepository } from './stores.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoresRepository]),
  ],
  providers: [StoresService],
  controllers: [StoresController]
})
export class StoresModule {}
