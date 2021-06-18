import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresRepository } from '../stores/stores.repository';
import { AuthsModule } from '../auths/auths.module';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { ProductsService } from './products.service';
import { CategoriesRepository } from '../categories/categories.repository';
import { ImagesRepository } from '../images/images.repository';
import { ImagesService } from 'src/images/images.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoriesRepository]),
    TypeOrmModule.forFeature([ImagesRepository]),
    TypeOrmModule.forFeature([ProductsRepository]),
    TypeOrmModule.forFeature([StoresRepository]),
    AuthsModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ImagesService],
})
export class ProductsModule {}
