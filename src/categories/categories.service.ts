import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { AffectedRows } from '../common/interfaces/custom.interface';
import { ImagesService } from '../images/images.service';
import { Connection } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    @InjectRepository(CategoriesRepository)
    private readonly categoriesRepository: CategoriesRepository,
    private readonly imagesService: ImagesService,
  ) {}

  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoriesRepository.find({
      relations: ['image'],
      order: {
        priority: 'ASC',
      }
    });
  }

  async create(
    file: Express.Multer.File,
    dto: CreateCategoryDto
  ): Promise<AffectedRows> {
    let image = null;

    const runner = this.connection.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
      let rows = 0;
      
      image = await this.imagesService.create('categories', file);
      await runner.manager.save(image);

      const { name, priority } = dto;
      const createCategoryDto: CreateCategoryDto = { name, priority, image };
      const category = await this.categoriesRepository.create(createCategoryDto);
      await runner.manager.save(category);

      rows = 1;

      await runner.commitTransaction();
      return { rows };

    } catch (err) {
      await runner.rollbackTransaction();
      if (image !== null) await this.imagesService.remove(image);
      throw new InternalServerErrorException();

    } finally {
      await runner.release();
    }
  }
}
