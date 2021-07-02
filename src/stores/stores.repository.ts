import { EntityRepository, Repository } from 'typeorm';
import { StoreEntity } from './entities/store.entity';
//StoreEntity
@EntityRepository(StoreEntity)
export class StoresRepository extends Repository<StoreEntity> {}
