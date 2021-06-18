import { Body, Controller, Get, Post, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { AffectedRows } from '../common/interfaces/custom.interface';
import { AffectedRowsResponse } from '../common/responses/success.response';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreEntity } from './entities/store.entity';
import { GetStoresResponse } from './responses/get-stores.response';
import { StoresService } from './stores.service';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  @UseInterceptors(TransformInterceptor)
  @ApiTags('테스트')
  @ApiOperation({ summary: '스토어 조회' })
  @ApiOkResponse({ description: 'Success', type: GetStoresResponse })
  findAll(): Promise<StoreEntity[]> {
    return this.storesService.findAll();
  }

  @Post()
  @UseInterceptors(TransformInterceptor)
  @ApiTags('테스트')
  @ApiOperation({ summary: '스토어 추가' })
  @ApiBody({ type: CreateStoreDto })
  @ApiCreatedResponse({ description: 'Success', type: AffectedRowsResponse})
  create(@Body(ValidationPipe) dto: CreateStoreDto): Promise<AffectedRows> {
    return this.storesService.create(dto);
  }
}
