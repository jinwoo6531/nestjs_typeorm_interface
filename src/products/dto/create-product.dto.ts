import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { ImageEntity } from "../../images/entities/image.entity";

export class CreateProductDto {
  @ApiProperty({ description: '제목' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '분류 구분자' })
  @IsNotEmpty()
  category_ids: number[];

  @ApiProperty({ description: '스토어 구분자' })
  @IsNotEmpty()
  store_id: number;
  
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  thumbnails: ImageEntity[];
}
