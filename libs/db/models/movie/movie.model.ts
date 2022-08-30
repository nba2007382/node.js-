import { prop } from "@typegoose/typegoose";


export class Movie {
  @prop()
  directors: Array<any>

  @prop()
  rate: String

  @prop()
  title: String

  @prop()
  url: String

  @prop()
  cover: String

  @prop()
  casts: Array<any>

  @prop({ unique: true })
  id:Number

  @prop()
  tag: Array<string>
}