import {
  BaseEntity,
  Column,
  Connection,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  ViewEntity,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryEntity } from '../../categories/entities/category.entity';
import { ImageEntity } from '../../images/entities/image.entity';
import { StoreEntity } from '../../stores/entities/store.entity';
import { TagEntity } from '../../tags/entities/tag.entity';

@Entity({ name: 'product' })
export class ProductEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: '제목' })
  @Column('varchar', { name: 'title', length: 200 })
  title: string;

  @ApiProperty({ description: '내용' })
  @Column('text', { name: 'content' })
  content: string;

  @ApiProperty({ type: () => CategoryEntity, isArray: true })
  @ManyToMany(() => CategoryEntity, {
    eager: false,
    nullable: false,
    cascade: true,
  })
  @JoinTable({
    name: 'product_category',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: CategoryEntity[];

  @ApiProperty({ type: () => ImageEntity, isArray: true })
  @ManyToMany(() => ImageEntity, {
    eager: false,
    nullable: false,
    cascade: true,
  })
  @JoinTable({
    name: 'thumbnail',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'image_id', referencedColumnName: 'id' },
  })
  thumbnails: ImageEntity[];

  @ApiProperty({ type: () => TagEntity, isArray: true })
  @ManyToMany(() => TagEntity, { eager: false, nullable: false, cascade: true })
  @JoinTable({
    name: 'product_tag',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: TagEntity[];

  @ApiProperty({ type: () => StoreEntity })
  @ManyToOne(() => StoreEntity, {
    eager: false,
    nullable: false,
    cascade: true,
  })
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @ApiProperty({ description: '찜 여부' })
  favorite_yn: string;

  @ApiProperty({ description: '원가' })
  @Column('int', { name: 'cost_price' })
  cost_price: number;

  @ApiProperty({ description: '판매가' })
  @Column('int', { name: 'sale_price' })
  sale_price: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', select: false })
  created_at: Date;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
    select: false,
  })
  modified_at: Date;
}
