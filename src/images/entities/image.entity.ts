import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'image' })
export class ImageEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column('text', { name: 'fkey', select: false })
  fkey: string;

  @ApiProperty({ description: '경로' })
  @Column('text', { name: 'url' })
  url: string;

  @ApiProperty({ description: '가로길이' })
  @Column('int', { name: 'width' })
  width: number;

  @ApiProperty({ description: '세로길이' })
  @Column('int', { name: 'height' })
  height: number;

  @ApiProperty({ description: '파일크기' })
  @Column('int', { name: 'size' })
  size: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', select: false })
  created_at: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP', select: false })
  modified_at: Date;
}
