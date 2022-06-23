const monito_WeiBo = require('../../models/monito/WeiBo')


class monito {
    async getwatchList(req, res, next) {
        const { userEmail } = req.body.userInfo
        const list = await monito_WeiBo.find({ from: userEmail })
        res.send({ list })
    }

    async addWatchList(req, res, next) {
        try {
            console.log("添加微博开始");
            const { url } = req.query
            const { userEmail } = req.body.userInfo
            const pattern = /(?<=https:[/][/]weibo.com[/]u[/])\d+/
            const id = pattern.exec(url)
            const index = await monito_WeiBo.find({ "user.id": id, from: userEmail })
            console.log("添加微博中");
            if (index.length == 0) {
                console.log("进入添加流程");
                const Index = await monito_WeiBo.find({ "user.id": id })
                if (Index == 0) {
                    await monito_WeiBo.addWB(url, userEmail)
                } else {

                    await monito_WeiBo.updateOne({ "user.id": id }, { $addToSet: { from: userEmail } })
                }
                res.send({
                    msg: '关注成功'
                })
            } else {
                res.send({
                    msg: '已经关注过了'
                })
            }
        } catch (error) {
            res.send({
                msg: '错误' + error
            })
        }
    }

    async delWatchList(req, res, next) {
        try {
            const { id } = req.query
            const { userEmail } = req.body.userInfo
            const avator = await monito_WeiBo.find({ "user.id": id })
            if (avator[0].from.length == 1) {
                await monito_WeiBo.deleteMany({ "user.id": id })
            } else {
                await monito_WeiBo.updateOne({ "user.id": id }, { $pull: { from: { $in: [userEmail] } } })
            }
            res.send({
                msg: '删除成功'
            })
        } catch (error) {
            res.send({
                msg: '错误' + error
            })
        }
    }

}
module.exports = new monito()