import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthsRepository } from './auths.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserEntity } from '../users/entities/user.entity';
import { AuthToken } from './interfaces/auth-token.interface';
import { AuthSignIn } from './interfaces/auth-signin.interface';
import { AffectedRows, IsExist } from '../common/interfaces/custom.interface';
import { IsExistAuthDto } from './dto/is-exist-auth.dto.ts';
import { UsersRepository } from '../users/users.repository';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Connection } from 'typeorm';
import { GetAuthDto } from './dto/get-auth.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { AuthEntity } from './entities/auth.entity';

@Injectable()
export class AuthsService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    @InjectRepository(AuthsRepository)
    private readonly authsRepository: AuthsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async isExist(dto: IsExistAuthDto): Promise<IsExist> {
    const { platform_type, platform_key } = dto;
    const getAuthDto: GetAuthDto = { platform_type, platform_key };
    const auth = await this.get(getAuthDto);
    const exist_yn = auth ? 'Y' : 'N';
    return { exist_yn };
  }

  async signIn(dto: AuthCredentialsDto): Promise<AuthSignIn> {
    const runner = this.connection.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
      const { platform_type, platform_key, message_token } = dto;
      const getAuthDto: GetAuthDto = { platform_type, platform_key };
      const auth = await this.get(getAuthDto);
      if (!auth) {
        throw new NotFoundException();
      }

      // 사용자 정보 갱신
      const updateUserDto: UpdateUserDto = { message_token };
      const user = await this.usersRepository.findOne(auth.user);
      user.message_token = updateUserDto.message_token;
      await runner.manager.save(user);
      auth.user = user;
      await runner.manager.save(auth);

      // 로그인 토큰 조회
      const token = await this.getAccessToken(user);

      await runner.commitTransaction();
      return { user: auth.user, ...token };
    } catch (err) {
      await runner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await runner.release();
    }
  }

  async signUp(dto: AuthCredentialsDto): Promise<AffectedRows> {
    const runner = this.connection.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
      let rows = 0;

      const { platform_type, platform_key, message_token } = dto;
      const getAuthDto: GetAuthDto = { platform_type, platform_key };
      const auth = await this.get(getAuthDto);

      // 데이터가 없을 시 추가
      if (!auth) {
        const createUserDto: CreateUserDto = { message_token };

        const user = await this.usersRepository.create(createUserDto);
        await runner.manager.save(user);

        const createAuthDto: CreateAuthDto = {
          platform_type,
          platform_key,
          user,
        };

        const auth = await this.authsRepository.create(createAuthDto);
        await runner.manager.save(auth);

        rows = 1;
      }

      await runner.commitTransaction();
      return { rows };
    } catch (err) {
      await runner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await runner.release();
    }
  }

  private async get(dto: GetAuthDto): Promise<AuthEntity> {
    return await this.authsRepository.findOne(dto);
  }

  private async getAccessToken(user: UserEntity): Promise<AuthToken> {
    const payload: JwtPayload = { user_id: user.id };
    const access_token = await this.jwtService.sign(payload);
    return { access_token };
  }
}
