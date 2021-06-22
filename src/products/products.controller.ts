import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
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
import { ProductEntity } from './entities/product.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { GetStore } from 'src/stores/get-store.decorator';
import { StoreEntity } from 'src/stores/entities/store.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UseInterceptors(TransformInterceptor)
  @ApiTags('상품')
  @ApiOperation({ summary: '상품 목록 조회' })
  @ApiOkResponse({ description: 'Success', type: GetProductsResponse })
  findAll(): Promise<ProductEntity[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  @UseInterceptors(TransformInterceptor)
  @ApiTags('상품')
  @ApiOperation({ summary: '상품 정보 조회' })
  @ApiOkResponse({ description: 'Success', type: GetProductsResponse })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductEntity> {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard())
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
    @GetStore() store: StoreEntity,
  ): Promise<AffectedRows> {
    return this.productsService.create(files, dto, store);
  }
}
