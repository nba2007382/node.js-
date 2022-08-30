import { prop } from "@typegoose/typegoose";


export class JD {
  @prop()
  id: Number

  @prop()
  title: String

  @prop()
  href: String

  @prop()
  img: String

  @prop()
  price: Array<Number>

  @prop()
  label: String

  @prop()
  time: Array<Number>

  @prop()
  from: Array<Number>
}