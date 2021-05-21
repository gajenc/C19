import { Entity, Column, OneToMany, OneToOne, JoinColumn, } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { Location } from './Location'
import { Channel } from './Channel'
import { ClientType } from './ClientType'
import { Api } from './Api'

@Entity()
export class Client extends BaseEntity {

  @OneToMany(type => ClientType, clientType => clientType.client, { cascade: true, eager: true })
  types: ClientType[];

  @Column({ length: 100, nullable: false })
  name: string;

  @Column({ length: 100, nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ length: 20, nullable: false })
  phone: string;

  @Column({ length: 100, nullable: false })
  email: string;

  @Column({ type: 'simple-array', default: null })
  documents: string[];

  @Column({ default: null })
  registration: string;

  @Column({ default: null })
  gateway_jwt_secret: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: true })
  serviceable: boolean;

  @OneToOne(type => Location, { cascade: true, eager: true })
  @JoinColumn()
  location: Location;

  @OneToMany(type => Channel, channel => channel.client, { cascade: true, eager: true })
  supported_channels: Channel[];

  @OneToMany(type => Api, api => api.client, { cascade: true, eager: true })
  endpoints: Api[];
}
