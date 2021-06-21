import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AffectedRows } from '../common/interfaces/custom.interface';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreEntity } from './entities/store.entity';
import { StoresRepository } from './stores.repository';
import { Connection } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(StoresRepository)
    private readonly storesRepository: StoresRepository,
    private readonly connection: Connection,
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
      if (error.code === '23505') {
        throw new ConflictException('에러입니다.');
      } else {
        throw new InternalServerErrorException();
      }
      await runner.rollbackTransaction();
    } finally {
      await runner.release();
    }

    // await this.storesRepository.insert({
    //   bnum,
    //   name,
    //   road_address,
    //   detail_address,
    //   longitude,
    //   latitude,
    //   phone,
    //   owner_name: '',
    //   password: '',
    //   salt: '',
    // });
  }
}
