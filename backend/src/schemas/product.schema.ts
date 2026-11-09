
import {
  Entity,
  ObjectIdColumn,
  Column
} from 'typeorm';

import { ObjectId } from 'mongodb';

@Entity('products')
export class Product {

  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  name!: string;

  @Column('decimal')
  price!: number;

  @Column()
  description!: string;
}
