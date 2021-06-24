import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
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
import { GetStoresResponse } from './responses/get-stores.response';
import { StoresService } from './stores.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { StoresGuard } from './stores.guard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('stores')
export class StoresController {
  constructor(
    private readonly storesService: StoresService,
    private readonly jwtService: JwtService,
  ) {}

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

  // @Post('/signin')
  // @UseInterceptors(TransformInterceptor)
  // signIn(@Body() dto: SigninStoreDto): Promise<StoreSignIn> {
  //   return this.storesService.signIn(dto);
  // }

  @Post('/signin')
  @UseInterceptors(TransformInterceptor)
  async signIn(
    @Body('name') name: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const store = await this.storesService.findOne({ name });

    if (!store) {
      throw new NotFoundException('스토어를 찾을 수 없습니다.');
    }

    if (!(await bcrypt.compare(password, store.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const jwt = await this.jwtService.signAsync({ id: store.id });
    response.cookie('jwt', jwt, { httpOnly: true });

    return store;
  }

  @UseGuards(StoresGuard)
  @Post('/auth')
  async store(@Req() req: Request) {
    const cookie = req.cookies['jwt'];

    const data = await this.jwtService.verifyAsync(cookie);
    return this.storesService.findOne({ id: data['id'] });
  }

  @UseGuards(StoresGuard)
  @Post('/logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'Success',
    };
  }
}
