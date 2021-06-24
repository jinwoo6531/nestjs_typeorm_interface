import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AffectedRows } from '../common/interfaces/custom.interface';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreEntity } from './entities/store.entity';
import { StoresRepository } from './stores.repository';
import { Connection } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { SigninStoreDto } from './dto/signin-store.dto';
import { StoreSignIn } from './interfaces/signin.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(StoresRepository)
    private readonly storesRepository: StoresRepository,
    private readonly connection: Connection,
    private jwtService: JwtService,
  ) {}

  async findAll(): Promise<StoreEntity[]> {
    return await this.storesRepository.find();
  }

  async create(dto: CreateStoreDto): Promise<AffectedRows> {
    const runner = this.connection.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
      let rows = 0;

      const {
        bnum,
        name,
        password,
        road_address,
        detail_address,
        longitude,
        latitude,
        phone,
      } = dto;

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const store = await this.storesRepository.create({
        bnum,
        name,
        road_address,
        detail_address,
        longitude,
        latitude,
        phone,
        owner_name: '',
        password: hashedPassword,
        salt: '',
      });
      await runner.manager.save(store);

      rows = 1;

      await runner.commitTransaction();
      return { rows: 1 };
    } catch (error) {
      await runner.rollbackTransaction();
    } finally {
      await runner.release();
    }
  }

  // async signIn(dto: SigninStoreDto): Promise<StoreSignIn> {
  //   const { name, password } = dto;
  //   const store = await this.storesRepository.findOne({ name });

  //   if (store && (await bcrypt.compare(password, store.password))) {
  //     const payload = { name };
  //     const access_token: string = await this.jwtService.sign(payload);
  //     return { access_token };
  //   } else {
  //     throw new UnauthorizedException('Please check your login credentials');
  //   }
  // }

  async signIn(dto: SigninStoreDto, response: Response) {
    const { name, password } = dto;
    const store = await this.storesRepository.findOne({ name });

    if (store && (await bcrypt.compare(password, store.password))) {
      const payload = { name };
      // const access_token: string = await this.jwtService.sign(payload);
      // return { access_token };
      const jwt = await this.jwtService.signAsync({ id: store.id });
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async findOne(condition): Promise<StoreEntity> {
    return this.storesRepository.findOne(condition);
  }
}
