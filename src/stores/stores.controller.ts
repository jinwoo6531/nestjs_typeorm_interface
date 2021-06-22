import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { AffectedRows } from '../common/interfaces/custom.interface';
import { AffectedRowsResponse } from '../common/responses/success.response';
import { CreateStoreDto } from './dto/create-store.dto';
import { SigninStoreDto } from './dto/signin-store.dto';
import { StoreEntity } from './entities/store.entity';
import { StoreSignIn } from './interfaces/signin.interface';
import { JwtAuthGuard } from './jwt-auth.guard';
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
  @ApiCreatedResponse({ description: 'Success', type: AffectedRowsResponse })
  create(@Body(ValidationPipe) dto: CreateStoreDto): Promise<AffectedRows> {
    return this.storesService.create(dto);
  }

  @Post('/signin')
  @UseInterceptors(TransformInterceptor)
  signIn(@Body() dto: SigninStoreDto): Promise<StoreSignIn> {
    return this.storesService.signIn(dto);
  }

  @Post('/test')
  @UseGuards(JwtAuthGuard)
  test(@Req() req) {
    console.log(req.user);
  }
}
