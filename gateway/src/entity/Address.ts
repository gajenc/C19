import { Entity, Column, } from 'typeorm';
import { BaseEntity } from './BaseEntity'

@Entity()
export class Address extends BaseEntity {
  @Column({ nullable: true, default: null })
  door: string;

  @Column({ nullable: true, default: null })
  building: string;

  @Column({ nullable: true, default: null })
  street: string;

  @Column({ nullable: true, default: null })
  area: string;

  @Column({ nullable: true, default: null })
  city: string;

  @Column({ nullable: true, default: null })
  country: string;

  @Column({ nullable: true, default: null })
  area_code: string;
}
