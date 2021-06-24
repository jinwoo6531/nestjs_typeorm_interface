import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { AffectedRowsResponse } from '../common/responses/success.response';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { AffectedRows } from '../common/interfaces/custom.interface';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesResponse } from './responses/get-categories.response';
import { GetProductsResponse } from '../products/responses/get-products.response';
import { CategoryEntity } from './entities/category.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { ProductsService } from '../products/products.service';
import { GetProductsFilterDto } from 'src/products/dto/get-products-filter.dto';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  @UseInterceptors(TransformInterceptor)
  @ApiTags('상품')
  @ApiOperation({ summary: '분류 조회' })
  @ApiOkResponse({ description: 'Success', type: GetCategoriesResponse })
  findAll(): Promise<CategoryEntity[]> {
    return this.categoriesService.findAll();
  }

  // @Get(':id/products')
  // @UseInterceptors(TransformInterceptor)
  // @ApiTags('상품')
  // @ApiOperation({ summary: '분류별 상품 조회' })
  // @ApiOkResponse({ description: 'Success', type: GetProductsResponse })
  // findByCategory(
  //   @Param('id', ParseIntPipe) id: number,
  // ): Promise<ProductEntity[]> {
  //   const getProductsFilterDto: GetProductsFilterDto = { category_id: id };
  //   return this.productsService.find(getProductsFilterDto);
  // }

  @Post()
  //파일이있는 HTML 양식의 필드 이름을 제공하는 문자열
  @UseInterceptors(FileInterceptor('image'))
  @UseInterceptors(TransformInterceptor)
  @ApiTags('테스트')
  @ApiOperation({ summary: '분류 추가' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateCategoryDto })
  @ApiCreatedResponse({ description: 'Success', type: AffectedRowsResponse })
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<AffectedRows> {
    return this.categoriesService.create(file, createCategoryDto);
  }
}
