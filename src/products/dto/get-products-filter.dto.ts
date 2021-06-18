import { IsOptional } from "class-validator";

export class GetProductsFilterDto {
  @IsOptional()
  category_id?: number;

  @IsOptional()
  q?: number;
}
