import { Entity, Column, ManyToOne, } from 'typeorm';
import { BaseEntity } from './BaseEntity'
import { Client } from './Client'
import { ClientTypeEnum } from '../constants/clent-types';


@Entity()
export class ClientType extends BaseEntity {
  @Column({
    type: "enum",
    enum: ClientTypeEnum,
    nullable: false,
  })
  name: ClientTypeEnum

  @ManyToOne(type => Client, client => client.types)
  client: Client;
}
