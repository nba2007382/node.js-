import { prop } from "@typegoose/typegoose";


export class WeiBo {
  @prop({unique: true})
  id: number

  @prop({
    id:{
      unique: true
    }
  })
  user: {
    id: number
    screen_name: string,
    profile_image_url: string,
  }

  @prop()
  created_at: string

  @prop()
  pic_infos: object

  @prop()
  text_raw: string

  @prop()
  text: string

  @prop()
  pic_ids: Array<any>

  @prop()
  pic_num: number

  @prop()
  isLongText: boolean

  @prop()
  is_show_bulletin: number

  @prop()
  isTop: number

  @prop()
  region_name: string

  @prop()
  from: Array<string>

  @prop()
  url: string
}