
const monito_BeiKe = require('../../models/monito/BeiKe')

class monito {
    async gethouse(req, res, next) {
        const { userEmail } = req.body.userInfo
        const list = await monito_BeiKe.find({ from: userEmail })
        res.send({
            status: 1,
            data: list
        })
    }
    async addhouse(req, res, next) {
        try {
            let params = req.query;
            const url = JSON.parse(params.url)._value
            const { userEmail } = req.body.userInfo
            let pattern = /[a-z]+\d+/; //从url中筛选出—id
            //id
            const id = '' + pattern.exec(url)[0]
            const data = await monito_BeiKe.find({ id })

            if (data.length == 0) {
                await monito_BeiKe.addhouse(url, id, userEmail)
                res.send({
                    status: 1,
                    message: '添加成功'
                })
                return
            }
            const index = await monito_BeiKe.find({ id, from: userEmail })
            if (index.length !== 0) {
                throw new Error('已添加过该商品')
            } else {
                await monito_BeiKe.updateMany({ id }, { $addToSet: { from: userEmail } })
                res.send({
                    status: 1,
                    message: '添加成功'
                })
                return
            }
        } catch (error) {
            res.send({
                status: 1,
                type: 'add_House_Failed',
                message: error + '---添加失败'
            })
            return
        }
    }
    async delhouse(req, res, next) {
        try {
            const { id } = req.body
            const { userEmail } = req.body.userInfo
            const data = await monito_BeiKe.find({ id: id, from: userEmail })
            console.log(data[0]);
            console.log(data[0].from);
            if (data[0].from.length == 1) {
                await monito_BeiKe.deleteMany({ id: id, from: userEmail })
                res.send({
                    status: 1,
                    message: '删除成功'
                })
                return
            } else {
                await monito_BeiKe.updateOne({ id }, { $pull: { from: { $in: [userEmail] } } })
                res.send({
                    status: 1,
                    message: '删除成功'
                })
                return
            }
        } catch (err) {
            res.send({
                status: 1,
                message: '删除失败'
            })
            return
        }
    }
}

module.exports = new monito()