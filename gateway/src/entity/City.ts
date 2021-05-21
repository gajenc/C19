import { Entity, Column, } from 'typeorm';
import { BaseEntity } from './BaseEntity'

@Entity()
export class City extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  code: string;
}
