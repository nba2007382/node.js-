const jwt = require('jsonwebtoken')
const dayjs = require('dayjs')
const secretKey = require('../config/tokenKey')


const token = {
    addLoginToken({ name, email }) {

        return jwt.sign({
            userEmail: email,
            userName: name,
            exp: dayjs().add(30, 'm').valueOf()
        }, secretKey.login)
    },
    addActiveToken(email) {
        return jwt.sign({
            email,
            exp: dayjs().add(30, 'm').valueOf()
        }, secretKey.register)
    },
    addRefreshLoginToken({ name, email }) {
        return jwt.sign({
            userEmail: email,
            userName: name,
            exp: dayjs().add(8, 'h').valueOf()
        }, secretKey.login)
    },
    verifyLoginToken(token, callback) {
        jwt.verify(token, secretKey.login, callback)
    },
    verifyActiveToken(res, token, account, adminModel) {
        jwt.verify(token, secretKey.register, async function(err, payload) {
            if (err) {
                res.send({
                    status: 403,
                    message: '您的链接有问题'
                })
                return
            }
            const { exp, email } = payload
            // refreshToken过期，重新登录
            if (dayjs().isAfter(exp)) {
                res.send({
                    status: 401,
                    message: "您的链接失效"
                })
                return
            } else if (email !== account) {
                res.send({
                    status: 403,
                    message: "您激活的账号有问题"
                })
            }
            const data = await adminModel.find({ email })
            if (data.status == 1) {
                res.send({
                    status: 1,
                    message: '您的账号已经激活过'
                })
                return
            }
            adminModel.updateMany({ email }, { $set: { status: 1 } }).then(() => {
                res.send({
                    status: 200,
                    message: '您的账号成功激活' + email
                })
                return
            })

        })
    },
    verifyRefreshLoginToken(token, callback) {
        jwt.verify(token, secretKey.login, callback)
    }
}

module.exports = token