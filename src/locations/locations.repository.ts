import { EntityRepository, Repository } from "typeorm";
import { LocationEntity } from "./entities/location.entity";

@EntityRepository(LocationEntity)
export class LocationsRepository extends Repository<LocationEntity> {}
