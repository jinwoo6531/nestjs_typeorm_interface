import { ApiProperty } from "@nestjs/swagger";
import { BaseResponse } from "../../common/responses/base.response";
import { ProductEntity } from "../entities/product.entity";

export abstract class GetProductsResponse extends BaseResponse {
  @ApiProperty({ isArray: true })
  data: ProductEntity
}