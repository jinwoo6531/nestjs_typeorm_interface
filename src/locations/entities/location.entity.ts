import { UserEntity } from "../../users/entities/user.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'location' })
export class LocationEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: '도로명 주소' })
  @Column('varchar', { name: 'road_address', length: 1000 })
  road_address: string;

  @ApiProperty({ description: '상세 주소', required: false })
  @Column('varchar', { name: 'detail_address', length: 1000, default: '' })
  detail_address: string;

  @ApiProperty({ description: '건물명', required: false })
  @Column('varchar', { name: 'building_name', length: 100, default: '' })
  building_name: string;

  @ApiProperty({ description: '경도, 소수점 6자리까지' })
  @Column('decimal', { name: 'longitude', precision: 10, scale: 6 })
  longitude: number;

  @ApiProperty({ description: '위도, 소수점 6자리까지' })
  @Column('float', { name: 'latitude', precision: 10, scale: 6 })
  latitude: number;

  @ManyToOne(() => UserEntity, {
    eager: false, nullable: false, onUpdate: 'CASCADE', onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', select: false })
  created_at: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP', select: false })
  modified_at: Date;
}
