import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { ImageEntity } from '../images/entities/image.entity';
import { ImagesService } from '../images/images.service';
import { CategoriesRepository } from '../categories/categories.repository';
import { ProductsRepository } from './products.repository';
import { StoresRepository } from '../stores/stores.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsFilterDao } from './dao/get-products-filter.dao';
import { MetaData } from '../common/models/meta.model';
import { AffectedRows } from '../common/interfaces/custom.interface';
import { TagsService } from '../tags/tags.service';
import { TagEntity } from '../tags/entities/tag.entity';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly tagsService: TagsService,
    @InjectConnection()
    private readonly connection: Connection,
    @InjectRepository(CategoriesRepository)
    private readonly categoriesRepository: CategoriesRepository,
    @InjectRepository(ProductsRepository)
    private readonly productsRepository: ProductsRepository,
    @InjectRepository(StoresRepository)
    private readonly storesRepository: StoresRepository,
  ) {}

  async find(dto: GetProductsFilterDao): Promise<MetaData> {
    return await this.productsRepository.filter(dto);
  }

  async findAll(): Promise<ProductEntity[]> {
    return await this.productsRepository.getItems();
  }

  // async findOne(id: number): Promise<ProductEntity> {
  //   return await this.productsRepository.getItemById(id);
  // }

  async create(files: Array<Express.Multer.File>, dto: CreateProductDto): Promise<AffectedRows> {
    const runner = this.connection.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    let thumbnails: ImageEntity[] = [];
    try {
      let rows = 0;
      if (typeof dto.tag_titles === 'string') { dto.tag_titles = [dto.tag_titles]; }

      const { category_ids, store_id, tag_titles } = dto;
      const store = await this.storesRepository.findOne(store_id);
      const categories = await this.categoriesRepository.findByIds(category_ids);
      
      
        for (const file of files) {
          const thumbnail = await this.imagesService.create('thumbnails', file);
          await runner.manager.save(thumbnail);
          thumbnails.push(thumbnail);
        }
      
      
      let tags: TagEntity[] = [];
      for (const tag_title of tag_titles) {
        const tag = await this.tagsService.findOne(tag_title);
        tags.push(tag);
      }      
      const product = await this.productsRepository.create({
        title: dto.title,
        content: dto.content,
        cost_price: +dto.cost_price,
        sale_price: +dto.sale_price,
        categories,
        tags,
        store,
        thumbnails
      });
      
      
      await runner.manager.save(product);
      rows = 1;

      await runner.commitTransaction();
      return { rows };

    } catch (err) {
      console.log(err);
      
      await runner.rollbackTransaction();
      for (const thumbnail of thumbnails) { await this.imagesService.remove(thumbnail); }
      throw new InternalServerErrorException();

    } finally {
      await runner.release();
    }
  }
}
