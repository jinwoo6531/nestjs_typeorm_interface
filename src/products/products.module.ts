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
import { StoresModule } from 'src/stores/stores.module';
import { TagsRepository } from '../tags/tags.repository';
import { TagsService } from '../tags/tags.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoriesRepository]),
    TypeOrmModule.forFeature([ImagesRepository]),
    TypeOrmModule.forFeature([ProductsRepository]),
    TypeOrmModule.forFeature([StoresRepository]),
    TypeOrmModule.forFeature([TagsRepository]),
    AuthsModule,
    StoresModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ImagesService,TagsService],
})
export class ProductsModule {}
