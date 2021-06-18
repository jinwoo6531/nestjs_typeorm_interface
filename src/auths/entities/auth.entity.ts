import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";

@Entity({ name: 'auth' })
@Unique(['platform_type', 'platform_key'])
export class AuthEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column('varchar', { name: 'platform_type', length: 20 })
  platform_type: string;

  @Column('varchar', { name: 'platform_key', length: 100 })
  platform_key: string;

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
