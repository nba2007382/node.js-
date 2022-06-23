const mongoose = require("mongoose")
const Schema = mongoose.Schema
const https = require('https')
const cheerio = require('cheerio')
const houseSchema = new Schema({
    housedel_id: {
        type: Number,
        unique: true
    },
    name: String,
    title: String,
    href: String,
    img: String,
    position: String,
    houseIcon: String,
    price: Number,
    untiprice: Number,
    time: Number
})

houseSchema.statics.updata = async function() {
    try {
        console.log('更新贝壳列表');
        const type = ['xiangzhouqu', 'jinwanqu', 'doumenqu']
        let allFilms = []
        for (let j = 0; j < type.length; j++) {
            const County = type[j];
            const stopNum = 101
            for (let i = 1; i < stopNum; i++) {
                let url = 'https://zh.ke.com/ershoufang/' + County + '/pg' + i + 'co42/'
                await new Promise((resolve) => {
                    setTimeout(() => {
                        https.get(url, function(res) {
                            let html = ''

                            res.on('data', function(chunk) {

                                html += chunk
                            })
                            res.on('end', function() {
                                const $ = cheerio.load(html)
                                $('.sellListContent .clear').each(function() {
                                    if (img = $('.VIEWDATA .lj-lazy', this).attr('data-original') !== undefined) {
                                        let pattern = /housedel_id=\d+/;
                                        let num = /\D+/
                                        eval(pattern.exec($('.info .title a', this).attr('data-action'))[0]) //housedel_id
                                        const name = County == 'xiangzhouqu' ? '香洲区' : County == 'jinwanqu' ? '金湾区' : '斗门区'
                                        const title = $('.info .title a', this).attr('title')
                                        const href = $('.info .title a', this).attr('href') //跳转房屋信息链接
                                        const img = $('.VIEWDATA .lj-lazy', this).attr('data-original') //展示图片
                                        const position = $('.info .address .positionInfo a', this).text() //房子位置
                                        const houseIcon = $('.info .address .houseInfo ', this).text() //房屋简要信息
                                        const price = parseInt($('.info .address .priceInfo .totalPrice span', this).text())
                                        const up = $('.info .address .priceInfo .unitPrice span', this).text()
                                        const untiprice = parseInt(up.replace(num, '').replace(num, '')) //均价
                                        allFilms.push({ housedel_id, name, title, href, img, position, houseIcon, price, untiprice })
                                        resolve(1)
                                    }

                                })
                            });

                        })
                    }, 500);
                })
            }
        }
        for (let i = 0; i < allFilms.length; i++) {
            const el = allFilms[i];
            await house.updateMany({ housedel_id: el.housedel_id }, { name: el.name, title: el.title, href: el.href, img: el.img, position: el.position, houseIcon: el.houseIcon, price: el.price, untiprice: el.untiprice }, {
                upsert: true
            })
        }
        console.log('更新贝壳列表完毕');
        return
    } catch (error) {
        console.log('贝壳列表更新失败' + error);
        return
    }

}

const house = mongoose.model('houseData', houseSchema)


module.exports = house