//加载https模块, 只要是获取网站链接都需要的操作
const https = require('https')
    //加载之前下载的cheerio,在后面会有作用
const cheerio = require('cheerio')
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const dayjs = require('dayjs')
const monito_BeiKeSchema = new Schema({
    id: {
        type: String
    },
    title: String,
    href: String,
    img: String,
    price: {
        type: Array,
    },
    time: Array,
    from: Array
})
monito_BeiKeSchema.statics.addhouse = async function(url, id, email) {
    try {
        https.get(url, function(res) {
            let html = ''
            let data = []
            res.on('data', function(chunk) {
                html += chunk
            })
            res.on('end', async function() {
                const $ = cheerio.load(html)
                $('.sellDetailPage').each(function() {
                    const title = $('.title .main', this).attr('title')
                    const href = url //跳转房屋信息链接
                    const img = $($('.smallpic li', this)[0]).attr('data-src') //展示图片
                    const price = parseInt($('.content .price .total', this).text())
                    const from = [email]
                    const time = dayjs(new Date()).format('YYYY-MM-DD')
                    data.push({ id, title, href, img, price, from, time })
                })
                await monito_BeiKe.insertMany(data)
                console.log('添加成功');
                return
            });
        })
    } catch (err) {
        console.log("添加失败");
        throw new Error(err)
    }
}
monito_BeiKeSchema.statics.updatahouse = async function() {
    try {
        const data = await monito_BeiKe.find({});
        data.forEach((el) => {
            const url = el.href
            https.get(url, function(res) {
                let html = ''
                res.on('data', function(chunk) {
                    html += chunk
                })
                res.on('end', async function() {
                    const $ = cheerio.load(html)
                    $('.sellDetailPage').each(async function() {
                        const price = parseInt($('.content .price .total', this).text())
                        const time = dayjs(new Date()).format('YYYY-MM-DD')
                        await monito_BeiKe.updateMany({ id: el.id }, { $push: { price, time } })
                        console.log('BK添加成功' + el.id);
                    })
                    return
                });
            })
        })
        return
    } catch (error) {
        console.log('BK更新失败' + error);
        return
    }
}

const monito_BeiKe = mongoose.model('monito_BeiKe', monito_BeiKeSchema)


module.exports = monito_BeiKe