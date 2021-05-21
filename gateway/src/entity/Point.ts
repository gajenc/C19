import { Entity, Column, } from 'typeorm';
import { BaseEntity } from './BaseEntity'

@Entity()
export class Point extends BaseEntity {
  @Column({ nullable: false })
  lat: number;

  @Column({ nullable: false })
  lon: number;
}
