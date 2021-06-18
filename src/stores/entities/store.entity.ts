import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'store' })
export class StoreEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: '상호명' })
  @Column('varchar', { name: 'name', length: 100 })
  name: string;

  @ApiProperty({ description: '사업자번호' })
  @Column('char', { name: 'biznum', length: 10 })
  bnum: string;

  @ApiProperty({ description: '대표자명' })
  @Column('varchar', { name: 'owner_name', length: 100 })
  owner_name: string;

  @ApiProperty({ description: '도로명 주소' })
  @Column('varchar', { name: 'road_address', length: 1000 })
  road_address: string;

  @ApiProperty({ description: '상세 주소' })
  @Column('varchar', { name: 'detail_address', length: 1000, default: '' })
  detail_address: string;

  @ApiProperty({ description: '경도, 소수점 6자리까지' })
  @Column('float', { name: 'longitude', precision: 10, scale: 6 })
  longitude: number;

  @ApiProperty({ description: '위도, 소수점 6자리까지' })
  @Column('float', { name: 'latitude', precision: 10, scale: 6 })
  latitude: number;

  @ApiProperty({ description: '전화번호' })
  @Column('varchar', { name: 'phone', length: 50 })
  phone: string;

  @Column('varchar', { name: 'password', length: 200, select: false })
  password: string;

  @Column('varchar', { name: 'salt', length: 128, select: false })
  salt: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', select: false })
  created_at: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP', select: false })
  modified_at: Date;
}
