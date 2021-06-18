import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AffectedRows } from '../common/interfaces/custom.interface';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreEntity } from './entities/store.entity';
import { StoresRepository } from './stores.repository';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(StoresRepository)
    private readonly storesRepository: StoresRepository,
  ) {}

  async findAll(): Promise<StoreEntity[]> {
    return await this.storesRepository.find();
  }

  async create(dto: CreateStoreDto): Promise<AffectedRows> {
    const {
      bnum,
      name,
      road_address,
      detail_address,
      longitude,
      latitude,
      phone,
    } = dto;
    await this.storesRepository.insert({
      bnum,
      name,
      road_address,
      detail_address,
      longitude,
      latitude,
      phone,
      owner_name: '',
      password: '',
      salt: '',
    });
    return { rows: 1 };
  }
}
