import { ApiProperty } from '@nestjs/swagger';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({ description: '사업자번호' })
  @IsNotEmpty()
  bnum: string;

  @ApiProperty({ description: '상호명' })
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: '도로명 주소' })
  @IsNotEmpty()
  road_address: string;

  @ApiProperty({ description: '상세 주소', required: false })
  @IsOptional()
  detail_address?: string;

  @ApiProperty({ description: '경도, 소수점 6자리까지' })
  @IsNotEmpty()
  @IsLongitude()
  longitude: number;

  @ApiProperty({ description: '위도, 소수점 6자리까지' })
  @IsNotEmpty()
  @IsLatitude()
  latitude: number;

  @ApiProperty({ description: '전화번호' })
  @IsNotEmpty()
  phone: string;
}
