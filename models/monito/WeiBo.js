//加载https模块, 只要是获取网站链接都需要的操作
const https = require('https')
    //加载之前下载的cheerio,在后面会有作用
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const monito_WeiBoSchema = new Schema({
    user: {
        id: {
            type: Number,
            unique: true
        },
        screen_name: String,
        profile_image_url: String,

    },
    content: [{
        created_at: String,
        id: Number,
        pic_infos: Object,
        text_raw: String,
        text: String,
        pic_ids: Array,
        pic_num: Number,
        isLongText: Boolean,
        is_show_bulletin: Number,
        isTop: Number,
        region_name: String, //发布地址
    }],
    from: Array,
    url: String
})

monito_WeiBoSchema.statics.addWB = async function(url, email) {
    try {
        const pattern = /(?<=https:[/][/]weibo.com[/]u[/])\d+/
        const id = pattern.exec(url)
        let page = 1
        console.log("开始循环");
        for (let i = 0; i < page; i++) {
            let URL = 'https://weibo.com/ajax/statuses/mymblog?uid=' + id + '&page=' + page + '&feature=0'
            await getWB(URL, id).then(res => {
                if (res == 1) {
                    page = page + 1
                }
            })
        }
        return
    } catch (error) {
        console.log('添加失败');
        throw new Error(error)
    }

    async function getWB(URL, id) {
        try {
            return await new Promise((resolve, rejects) => {
                https.get(URL, {
                    headers: {
                        Cookie: 'UOR=www.coco81.com,widget.weibo.com,www.baidu.com; SINAGLOBAL=3452918211623.688.1577082560432; ULV=1654072796432:21:2:3:6163964172565.925.1654072796265:1654072719480; SUBP=0033WrSXqPxfM72-Ws9jqgMF55529P9D9WFfZrcRZK6Onoaxs-djjeIA; ALF=1685608738; SCF=AoTDrtRXG1-DFmR9ayAXDFFn2eCBj87ckr_JiTn1RZDzzNYLaH5Kd3W9UUfeFrmLU1vbSxF81djPurJ5gyaB8t8.; PC_TOKEN=206048118c; SUB=_2AkMVy6Taf8NxqwJRmfoQxWnja4p1wgDEieKjl1UBJRMxHRl-yT8XqmYctRB6PkuKNJ331-qt6v490mlr3L8cB9aK7oMs; SSOLoginState=1654072738; XSRF-TOKEN=Gu_QouqwbZ_XYPY_lJCeplFt; WBPSESS=1QIptkPh0r7VTljIOfRP674V4yLlo9FCiPK9bVOTXhKAoz2O0s02ZRYr8YwzKF-CdGGmTMQftlPl4Z-ZeITn2nd0PN7OOcgjAr5F-d3Yv6iEBbdvvgL1KRb-XsGt1oAvzcEj58Xkw2SdZigBJCnQrWpsSVwjbF9pn8bMA1l_rNE=; YF-V-WEIBO-G0=35846f552801987f8c1e8f7cec0e2230; _s_tentry=weibo.com; Apache=6163964172565.925.1654072796265'
                    }
                }, function(res) {
                    let html = ''
                    res.on('data', function(chunk) {
                        html += chunk
                    })
                    res.on('end', async function() {
                        const data = JSON.parse(html)
                        const { list } = data.data
                        if (list.length !== 0) {
                            for (let j = 0; j < list.length; j++) {
                                const el = list[j];
                                const index = await monito_WeiBo.find({ "user.id": id, "content.id": el.id })
                                if (index == 0) {
                                    await monito_WeiBo.updateMany({ "user.id": id }, { $addToSet: { from: email, content: el }, url: url, "user.screen_name": el.user.screen_name, "user.profile_image_url": el.user.profile_image_url }, {
                                        upsert: true
                                    })
                                }
                            }
                            resolve(1)
                            return
                        } else {
                            resolve(0)
                            return
                        }
                    })
                })
            })
        } catch (error) {
            console.log('微博获取失败' + error);
            return
        }

    }
}

monito_WeiBoSchema.statics.updataWB = async function() {
    try {
        console.log('WB更新')
        const data = await monito_WeiBo.find({})
        for (let i = 0; i < data.length; i++) {
            const el = data[i];
            const url = el.url
            const pattern = /(?<=https:[/][/]weibo.com[/]u[/])\d+/
            const id = pattern.exec(url)
            let page = 1
            for (let i = 0; i < page; i++) {
                let URL = 'https://weibo.com/ajax/statuses/mymblog?uid=' + id + '&page=' + page + '&feature=0'
                await getupdataWB(URL, id).then(res => {
                    if (res == 1) {
                        page = page + 1
                    }
                })
            }
        }
    } catch (error) {
        console.log('WB更新失败' + error);

    }

    async function getupdataWB(URL, id) {
        try {
            return await new Promise((resolve, rejects) => {
                https.get(URL, {
                    headers: {
                        Cookie: 'UOR=www.coco81.com,widget.weibo.com,www.baidu.com; SINAGLOBAL=3452918211623.688.1577082560432; ULV=1654072796432:21:2:3:6163964172565.925.1654072796265:1654072719480; SUBP=0033WrSXqPxfM72-Ws9jqgMF55529P9D9WFfZrcRZK6Onoaxs-djjeIA; ALF=1685608738; SCF=AoTDrtRXG1-DFmR9ayAXDFFn2eCBj87ckr_JiTn1RZDzzNYLaH5Kd3W9UUfeFrmLU1vbSxF81djPurJ5gyaB8t8.; PC_TOKEN=206048118c; SUB=_2AkMVy6Taf8NxqwJRmfoQxWnja4p1wgDEieKjl1UBJRMxHRl-yT8XqmYctRB6PkuKNJ331-qt6v490mlr3L8cB9aK7oMs; SSOLoginState=1654072738; XSRF-TOKEN=Gu_QouqwbZ_XYPY_lJCeplFt; WBPSESS=1QIptkPh0r7VTljIOfRP674V4yLlo9FCiPK9bVOTXhKAoz2O0s02ZRYr8YwzKF-CdGGmTMQftlPl4Z-ZeITn2nd0PN7OOcgjAr5F-d3Yv6iEBbdvvgL1KRb-XsGt1oAvzcEj58Xkw2SdZigBJCnQrWpsSVwjbF9pn8bMA1l_rNE=; YF-V-WEIBO-G0=35846f552801987f8c1e8f7cec0e2230; _s_tentry=weibo.com; Apache=6163964172565.925.1654072796265'
                    }
                }, function(res) {
                    let html = ''
                    res.on('data', function(chunk) {
                        html += chunk
                    })
                    res.on('end', async function() {
                        const data = JSON.parse(html)
                        const { list } = data.data
                        if (list.length !== 0) {
                            for (let j = 0; j < list.length; j++) {
                                const item = list[j];
                                const index = await monito_WeiBo.find({ "user.id": id, "content.id": item.id })
                                if (index.length == 0) {
                                    await monito_WeiBo.updateMany({ "user.id": id }, {
                                        $addToSet: {
                                            content: {
                                                created_at: item.created_at,
                                                id: item.id,
                                                pic_infos: item.pic_infos,
                                                text_raw: item.text_raw,
                                                text: item.text,
                                                pic_ids: item.pic_ids,
                                                pic_num: item.pic_num,
                                                isLongText: item.isLongText,
                                                is_show_bulletin: item.is_show_bulletin,
                                                isTop: item.isTop,
                                                region_name: item.region_name
                                            }
                                        },
                                        "user.screen_name": item.user.screen_name,
                                        "user.profile_image_url": item.user.profile_image_url
                                    }, {
                                        upsert: true
                                    })
                                }
                            }
                            resolve(1)
                        } else {
                            resolve(0)
                            return
                        }
                    })
                })
            })
        } catch (error) {
            console.log(error);
        }
    }
}

const monito_WeiBo = mongoose.model('monito_WeiBo', monito_WeiBoSchema)
module.exports = monito_WeiBo