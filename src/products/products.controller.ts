import { ProductEntity } from 'src/products/entities/product.entity';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { ProductsService } from './products.service';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { AffectedRowsResponse } from '../common/responses/success.response';
import { AffectedRows } from '../common/interfaces/custom.interface';
import { GetProductsResponse } from './responses/get-products.response';

import { FilesInterceptor } from '@nestjs/platform-express';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { StoresGuard } from 'src/stores/stores.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UseInterceptors(TransformInterceptor)
  @UseGuards(StoresGuard)
  @ApiTags('상품')
  @ApiOperation({ summary: '상품 목록 조회' })
  @ApiOkResponse({ description: 'Success', type: GetProductsResponse })
  findAll(
    @Query(ValidationPipe) dto: GetProductsFilterDto,
  ): Promise<ProductEntity[]> {
    console.log(dto);

    return this.productsService.findAll(dto);
  }

  // @Get(':id')
  // @UseInterceptors(TransformInterceptor)
  // @ApiTags('상품')
  // @ApiOperation({ summary: '상품 정보 조회' })
  // @ApiOkResponse({ description: 'Success', type: GetProductsResponse })
  // findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductEntity> {
  //   return this.productsService.findOne(id);
  // }

  @Post()
  @UseInterceptors(FilesInterceptor('thumbnails'))
  @UseInterceptors(TransformInterceptor)
  @ApiTags('테스트')
  @ApiOperation({ summary: '상품 추가' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductDto })
  @ApiCreatedResponse({ description: 'Success', type: AffectedRowsResponse })
  create(
    @Body(ValidationPipe) dto: CreateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<AffectedRows> {
    return this.productsService.create(files, dto);
  }
}
