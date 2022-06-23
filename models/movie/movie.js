const mongoose = require("mongoose")
const Schema = mongoose.Schema
const https = require('https')
const movieSchema = new Schema({
    directors: Array,
    rate: String,
    title: String,
    url: String,
    cover: String,
    casts: Array,
    id: {
        type: Number,
        unique: true
    },
    tag: Array,
})
movieSchema.statics.updata = async function() {
    try {
        console.log('正在更新豆瓣电影');
        const type = ['欧美', '美国', '日本']
        let allFilms = []
        for (let i = 0; i < type.length; i++) {
            const countries = type[i];
            const stop = 51
            for (let j = 0; j < stop; j++) {
                await new Promise((resolve) => {
                    setTimeout(() => {
                        let t = j * 20
                        let Obj = ''
                        let url = "https://movie.douban.com/j/new_search_subjects?sort=S&range=0,10&tags=&start=" + t + "&countries=" + countries
                        https.get(url, {
                            headers: {
                                Cookie: '__utma=30149280.518822778.1576997740.1652951427.1654599740.54; _pk_id.100001.4cf6=844cf19a4e48a5b1.1576997742.47.1654600709.1654497573.; __utma=223695111.625330076.1576997743.1652951427.1654599740.45; __utmz=30149280.1651911852.48.26.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; douban-fav-remind=1; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1654599739%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; __utmz=223695111.1651911865.39.10.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; ll="118283"; bid=tLcgbbOB0Sw; __gads=ID=741e44e0f52a198f-228460a321d10040:T=1648205868:RT=1648205868:S=ALNI_May_y7lFf-z2n-Qad53CyZcq7hCBw; _vwo_uuid_v2=D0F4572DAA5F5EC9904800187B19F9BB6|e4ef90189ab8e9b4b868b13479a92c69; __yadk_uid=U2DeQ36GX4EVJTfzLHbH9RPyFOLlbRjM; Hm_lvt_16a14f3002af32bf3a75dfe352478639=1650627627; _vwo_uuid_v2=D0F4572DAA5F5EC9904800187B19F9BB6|e4ef90189ab8e9b4b868b13479a92c69; _ga=GA1.2.518822778.1576997740; __gpi=UID=0000058f725a1290:T=1652951454:RT=1654599746:S=ALNI_MavmFgBNqZDoGK4vg43xuSPr3cC5A; _pk_ses.100001.4cf6=*; ap_v=0,6.0; __utmb=30149280.0.10.1654599740; __utmc=30149280; __utmb=223695111.7.10.1654599740; __utmc=223695111; __utmt=1'
                            }
                        }, function(res) {
                            res.on('data', function(chunk) {
                                Obj += chunk
                            })
                            res.on('end', function() {
                                Obj = JSON.parse(Obj)
                                if (Array.isArray(Obj.data)) {
                                    Obj.data.forEach((el) => {
                                        el.tag = countries
                                        allFilms.push(el)
                                        resolve(1)
                                    })
                                } else {
                                    console.log(Obj);
                                    console.log('豆瓣电影没爬取到');
                                    resolve(1)
                                }


                            })
                        })
                    }, 5000);
                })
            }

        }

        for (let i = 0; i < allFilms.length; i++) {
            const el = allFilms[i];
            await movie.updateMany({ id: el.id }, { directors: el.directors, rate: el.rate, title: el.title, url: el.url, cover: el.cover, casts: el.casts, $addToSet: { tag: el.tag } }, {
                upsert: true
            })
        }
        console.log('豆瓣更新完毕');
        return
    } catch (error) {
        console.log('豆瓣更新失败' + error);
    }

}
const movie = mongoose.model('movieData', movieSchema)


module.exports = movie