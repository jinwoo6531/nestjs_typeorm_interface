import { IsOptional } from 'class-validator';

export class GetProductsFilterDto {
  @IsOptional()
  store_id?: number;
}
