const mongoose = require("mongoose")
const Schema = mongoose.Schema
const puppeteer = require('puppeteer');
const dayjs = require('dayjs')
const browserFetcher = puppeteer.createBrowserFetcher();
const monitoJdSchema = new Schema({
    id: Number,
    title: String,
    href: String,
    img: String,
    price: Array,
    label: String,
    time: Array,
    from: Array
})
monitoJdSchema.statics.addgoods = async function(url, id, email) {
    try {

        const brower = await puppeteer.launch({
            headless: true
        })


        var page = await brower.newPage()
        await page.goto(url)
        let data = await getjdInfo()
        brower.close()
        await monito_JD.insertMany(data)
        console.log('添加成功');
        return
        async function getjdInfo() {
            let list = []
            const price = await page.$eval('.itemInfo-wrap  .summary-price-wrap .summary-price.J-summary-price .dd .p-price .price', el => el.innerHTML)
            const label = await page.$eval('.summary-price.J-summary-price .dt', el => el.innerHTML)
            const img = await page.$eval('.product-intro .preview-wrap #preview #spec-n1 #spec-img', el => el.src)
            const title = await page.$eval(' .w .product-intro.clearfix .itemInfo-wrap .sku-name', el => el.innerHTML)
            const from = email
            const href = url
            const time = dayjs(new Date()).format('YYYY-MM-DD')
            list.push({ price, label, img, title, id, href, from, time })
            return list
        }
    } catch (err) {
        console.log("添加失败");
        throw new Error(err)
    }
}
monitoJdSchema.statics.updatagoods = async function() {
    try {
        const data = await monito_JD.find({});
        for (let i = 0; i < data.length; i++) {
            const el = data[i];
            const url = el.href
            const brower = await puppeteer.launch({
                headless: true
            })
            var page = await brower.newPage()
            await page.goto(url)
            await updataInfo()
            brower.close()
            console.log('JD更新成功');
            return
            async function updataInfo() {
                const price = await page.$eval('.itemInfo-wrap  .summary-price-wrap .summary-price.J-summary-price .dd .p-price .price', el => el.innerHTML)
                const label = await page.$eval('.summary-price.J-summary-price .dt', el => el.innerHTML)
                const time = dayjs(new Date()).format('YYYY-MM-DD')
                await monito_JD.updateMany({ id: el.id }, { $push: { price, time }, $set: { label } })
            }
        }

    } catch (error) {
        console.log('JD更新失败' + error);
        return
    }
}

const monito_JD = mongoose.model('monito_JD', monitoJdSchema)


module.exports = monito_JD