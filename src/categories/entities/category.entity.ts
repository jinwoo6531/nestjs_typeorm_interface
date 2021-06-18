import { ApiProperty } from "@nestjs/swagger";
import { ImageEntity } from "../../images/entities/image.entity";
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'category' })
export class CategoryEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: '분류명' })
  @Column('varchar', { name: 'name', length: 100 })
  name: string;

  @ApiProperty({ type: () => ImageEntity })
  @OneToOne(() => ImageEntity, {
    eager: false, nullable: false, onUpdate: 'CASCADE', onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'image_id' })
  image: ImageEntity;

  @ApiProperty({ description: '우선 순위' })
  @Column('int', { name: 'priority' })
  priority: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', select: false })
  created_at: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP', select: false })
  modified_at: Date;
}
