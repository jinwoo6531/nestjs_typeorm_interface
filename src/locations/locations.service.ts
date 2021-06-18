import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { LocationsRepository } from './locations.repository';
import { LocationEntity } from "./entities/location.entity";
import { CreateLocationDto } from './dto/create-location.dto';
import { AffectedRows } from '../common/interfaces/custom.interface';
import { Connection } from 'typeorm';

@Injectable()
export class LocationsService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    @InjectRepository(LocationsRepository)
    private readonly locationsRepository: LocationsRepository,
  ) {}

  async find(user: UserEntity): Promise<LocationEntity[]> {
    return this.locationsRepository.find({ user });
  }

  async create(dto: CreateLocationDto, user: UserEntity): Promise<AffectedRows> {
    const runner = this.connection.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
      let rows = 0;

      dto.user = user;
      const location = await this.locationsRepository.create(dto);
      await runner.manager.save(location);
    
      rows = 1;

      await runner.commitTransaction();
      return { rows };

    } catch (err) {
      await runner.rollbackTransaction();
      throw new InternalServerErrorException();

    } finally {
      await runner.release();
    }
  }

  async remove(id: number, user: UserEntity): Promise<void> {
    const runner = this.connection.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
      const location = await this.locationsRepository.find({ id, user });
      await runner.manager.remove(location);
    
      await runner.commitTransaction();

    } catch (err) {
      await runner.rollbackTransaction();
      throw new InternalServerErrorException();

    } finally {
      await runner.release();
    }
  }
}
