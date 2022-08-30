import { prop } from "@typegoose/typegoose";


export class WeiBo {
  @prop({unique: true})
  id: Number

  @prop({
    id:{
      unique: true
    }
  })
  user: {
    id: Number
    screen_name: String,
    profile_image_url: String,
  }

  @prop()
  created_at: String

  @prop()
  pic_infos: Object

  @prop()
  text_raw: String

  @prop()
  text: String

  @prop()
  pic_ids: Array<any>

  @prop()
  pic_num: Number

  @prop()
  isLongText: Boolean

  @prop()
  is_show_bulletin: Number

  @prop()
  isTop: Number

  @prop()
  region_name: String

  @prop()
  from: Array<string>

  @prop()
  url: String
}