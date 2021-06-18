import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsLatitude, IsLongitude, IsNotEmpty, IsOptional } from "class-validator";
import { UserEntity } from "../../users/entities/user.entity";

export class CreateLocationDto {
  @ApiProperty({ description: '도로명 주소' })
  @IsNotEmpty()
  road_address: string;

  @ApiProperty({ description: '상세 주소', required: false })
  @IsOptional()
  detail_address?: string;

  @ApiProperty({ description: '건물명', required: false })
  @IsOptional()
  building_name?: string;

  @ApiProperty({ description: '경도, 소수점 6자리까지' })
  @IsNotEmpty()
  @IsLongitude()
  longitude: number;

  @ApiProperty({ description: '위도, 소수점 6자리까지' })
  @IsNotEmpty()
  @IsLatitude()
  latitude: number;

  @IsEmpty()
  user: UserEntity;
}
