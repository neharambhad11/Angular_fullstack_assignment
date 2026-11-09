
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';

import { User } from './user.entity';

@Entity('Orders')
export class Order {

  @PrimaryGeneratedColumn()
  orderId!: number;

  @Column()
  userId!: number;

  @Column({ type: 'nvarchar', length: 'MAX' })
  productIds!: string;

  @Column('decimal', {
    precision: 12,
    scale: 2
  })
  totalAmount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;
}
