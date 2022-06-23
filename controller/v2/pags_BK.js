const monito_BK = require('../../models/monito/BeiKe')

class pages_BK {
    async gethouseInfo(req, res, next) {
        const { id } = req.query
        const houseInfo = await monito_BK.find({ id })
        if (houseInfo) {
            res.send({
                houseInfo: houseInfo[0],
            })
            return
        }
        res.send({
            msg: '失败'
        })

    }
}



module.exports = new pages_BK()