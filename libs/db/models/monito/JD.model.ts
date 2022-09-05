import { prop } from "@typegoose/typegoose";


export class Monito_Jd {
  @prop()
  id: Number

  @prop()
  title: string

  @prop()
  href: string

  @prop()
  img: string

  @prop()
  price: Array<Number>

  @prop()
  label: string

  @prop()
  time: Array<Number>

  @prop()
  from: Array<Number>
}