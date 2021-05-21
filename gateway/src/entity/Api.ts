import { Entity, Column, ManyToOne, } from 'typeorm';
import { BaseEntity } from './BaseEntity'
import { Client } from './Client'

@Entity()
export class Api extends BaseEntity {
  @Column({ nullable: false })
  type: string;

  @Column({ nullable: false })
  url: string;

  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  exp: Date;

  @ManyToOne(type => Client, client => client.endpoints)
  client: Client;
}
