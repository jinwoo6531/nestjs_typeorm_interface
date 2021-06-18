import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ImagesService } from '../images/images.service';
import { ImageEntity } from '../images/entities/image.entity';
import { ProductEntity } from './entities/product.entity';
import { CategoriesRepository } from '../categories/categories.repository';
import { ProductsRepository } from './products.repository';
import { StoresRepository } from '../stores/stores.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { AffectedRows } from '../common/interfaces/custom.interface';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    @InjectRepository(ProductsRepository)
    private readonly categoriesRepository: CategoriesRepository,
    private readonly imagesService: ImagesService,
    private readonly productsRepository: ProductsRepository,
    private readonly storesRepository: StoresRepository,
  ) {}

  async find(dto: GetProductsFilterDto): Promise<ProductEntity[]> {
    const products = await this.productsRepository.find({
      relations: ['categories', 'store', 'thumbnails'],
      order: {
        id: 'ASC'
      }
    });
    products.forEach(product => product.categories.sort((a, b) => a.priority - b.priority));
    return products;
  }

  async findAll(): Promise<ProductEntity[]> {
    const products = await this.productsRepository.find({
      relations: ['categories', 'store', 'thumbnails'],
      order: {
        id: 'ASC'
      }
    });
    products.forEach(product => product.categories.sort((a, b) => a.priority - b.priority));
    return products;
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productsRepository.findOne(id, {
      relations: ['categories', 'store', 'thumbnails'],
    });
    product.categories.sort((a, b) => a.priority - b.priority);
    return product;
  }

  async create(
    files: Array<Express.Multer.File>,
    dto: CreateProductDto
  ): Promise<AffectedRows> {
    let thumbnails: ImageEntity[] = [];

    const runner = this.connection.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
      let rows = 0;

      const store = await this.storesRepository.findOne(dto.store_id);
      const categories = await this.categoriesRepository.findByIds(dto.category_ids);
      await runner.manager.save(categories);
      
      for (const file of files) {
        const thumbnail = await this.imagesService.create('thumbnails', file);
        await runner.manager.save(thumbnail);
        thumbnails.push(thumbnail);
      }

      const product = await this.productsRepository.create({
        title: dto.title,
        content: '',
        cost_price: 30000,
        sale_price: 27000,
        categories,
        store,
        thumbnails
      });
      await runner.manager.save(product);

      rows = 1;

      await runner.commitTransaction();
      return { rows };

    } catch (err) {
      await runner.rollbackTransaction();
      for (const thumbnail of thumbnails) { await this.imagesService.remove(thumbnail); }
      throw new InternalServerErrorException();

    } finally {
      await runner.release();
    }
  }
}
