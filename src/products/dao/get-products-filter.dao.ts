import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { UserEntity } from "../../users/entities/user.entity";

export class GetProductsFilterDao {
  @IsOptional()
  category_id?: number;

  @IsOptional()
  q?: string;

  @IsOptional()
  user?: UserEntity;

  @IsNotEmpty()
  @IsNumber()
  page: number;

  @IsNotEmpty()
  @IsNumber()
  rows: number;
}
