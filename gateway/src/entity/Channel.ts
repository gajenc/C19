import { Entity, Column, ManyToOne, } from 'typeorm';
import { BaseEntity } from './BaseEntity'
import { Client } from './Client'

export enum ChannelName {
  PHONE = "phone",
  CHAT = "chat",
  VIDEO = "video",
  AUDIO = "audio",
  PHYSICAL = "physical",
}

@Entity()
export class Channel extends BaseEntity {
  @Column({
    type: "enum",
    enum: ChannelName,
    nullable: false,
  })
  name: ChannelName

  @ManyToOne(type => Client, client => client.supported_channels)
  client: Client;
}
