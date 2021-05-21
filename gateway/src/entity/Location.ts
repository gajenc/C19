import { Entity, Column, JoinColumn, OneToOne, } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Point } from "./Point";
import { City } from "./City";
import { Address } from "./Address";
import { Country } from "./Country";

export enum LocationType {
  GPS = "gps",
  ADDRESS = "address",
  STATION_CODE = "station_code",
  AREA_CODE = "area_code",
  CITY = "city",
  COUNTRY = "country",
  POLYGON = "polygon",
  SPACE = "3dspace",
}

@Entity()
export class Location extends BaseEntity {
  @Column({
    type: "enum",
    enum: LocationType,
    default: undefined, 
    nullable: true,
  })
  type: LocationType

  @Column({ nullable: true, default: null })
  station_code: string;

  @Column({ nullable: true, default: null })
  area_code: string;

  @Column({ nullable: true, default: null })
  polygon: string;

  @Column({ nullable: true, default: null })
  space: string;

  @OneToOne(type => Point, { cascade: true, eager: true })
  @JoinColumn()
  gps: Point;

  @OneToOne(type => Address, { cascade: true, eager: true })
  @JoinColumn()
  address: Address;

  @OneToOne(type => City, { cascade: true, eager: true })
  @JoinColumn()
  city: City;

  @OneToOne(type => Country, { cascade: true, eager: true })
  @JoinColumn()
  country: Country;
}
