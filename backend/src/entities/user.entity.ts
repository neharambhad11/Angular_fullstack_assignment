
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn
} from 'typeorm';

@Entity('Users')
export class User {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 100 })
  username!: string;

  @Column({ select: false })
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
