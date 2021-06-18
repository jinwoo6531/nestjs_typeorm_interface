import {
  Body,
  Controller,
  Post,
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
import { AffectedRows, IsExist } from '../common/interfaces/custom.interface';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { AuthsService } from './auths.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthSignIn } from './interfaces/auth-signin.interface';
import { AuthSignInResponse } from './responses/auth-signin.response';
import {
  AffectedRowsResponse,
  IsExistResponse,
} from '../common/responses/success.response';
import { IsExistAuthDto } from './dto/is-exist-auth.dto.ts';

@ApiTags('가입')
@Controller('auths')
export class AuthsController {
  constructor(private authsService: AuthsService) {}

  @Post('signin')
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '로그인' })
  @ApiBody({ type: AuthCredentialsDto })
  @ApiOkResponse({ description: 'Success', type: AuthSignInResponse })
  signIn(@Body(ValidationPipe) dto: AuthCredentialsDto): Promise<AuthSignIn> {
    return this.authsService.signIn(dto);
  }

  @Post('signup')
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '가입' })
  @ApiBody({ type: AuthCredentialsDto })
  @ApiCreatedResponse({ description: 'Success', type: AffectedRowsResponse })
  signUp(@Body(ValidationPipe) dto: AuthCredentialsDto): Promise<AffectedRows> {
    return this.authsService.signUp(dto);
  }

  @Post('is-exist')
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({ summary: '가입 여부 확인' })
  @ApiBody({ type: IsExistAuthDto })
  @ApiCreatedResponse({ description: 'Success', type: IsExistResponse })
  isExist(@Body(ValidationPipe) dto: IsExistAuthDto): Promise<IsExist> {
    return this.authsService.isExist(dto);
  }
}
