import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthsModule } from '../auths/auths.module';
import { ImagesService } from '../images/images.service';
import { ImagesRepository } from '../images/images.repository';
import { ProductsService } from '../products/products.service';
import { ProductsRepository } from '../products/products.repository';
import { StoresRepository } from '../stores/stores.repository';
import { TagsRepository } from 'src/tags/tags.repository';
import { TagsService } from 'src/tags/tags.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoriesRepository]),
    TypeOrmModule.forFeature([ImagesRepository]),
    TypeOrmModule.forFeature([ProductsRepository]),
    TypeOrmModule.forFeature([StoresRepository]),
    TypeOrmModule.forFeature([TagsRepository]),
    AuthsModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, ImagesService, ProductsService, TagsService]
})
export class CategoriesModule {}
