const monito_JD = require('../../models/monito/JD')
const puppeteer = require('puppeteer');

class pages_JD {
    async getgoodsInfo(req, res, next) {
        const { id } = req.query
        const goodsInfo = await monito_JD.find({ id })
        const evaluate = await getevaluate(id, 1)
        if (evaluate && goodsInfo) {
            res.send({
                goodsInfo: goodsInfo[0],
                evaluate: evaluate.comments
            })
            return
        }
        res.send({
            msg: '失败'
        })

    }
    async getPagination(req, res, next) {
        const { pageIndex, id } = req.query
        const evaluate = await getevaluate(id, pageIndex)
        if (evaluate) {
            res.send({
                evaluate: evaluate.comments
            })
            return
        }
        res.send({
            msg: '失败'
        })
    }
}

async function getevaluate(id, pageIndex) {
    const brower = await puppeteer.launch({
        headless: true
    })
    var page = await brower.newPage()
    await page.goto('https://club.jd.com/comment/productPageComments.action?callback=fetchJSON_comment98&productId=' + id + '&score=0&sortType=5&page=' + pageIndex + '&pageSize=10&isShadowSku=0&fold=1')
    const data = await page.$eval('body', el => el.innerHTML)

    function fetchJSON_comment98(Obj) {
        return Obj
    }
    const evaluate = await eval(data)
    brower.close()
    return evaluate
}

module.exports = new pages_JD()