import { ApiProperty } from "@nestjs/swagger";

export abstract class BaseResponse {
  @ApiProperty({ default: '200' })
  code: number;

  @ApiProperty({ default: '' })
  message: string;
}
