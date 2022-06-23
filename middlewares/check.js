'use strict';
const adminModel = require('../models/admin/admin')
const { verifyLoginToken, verifyActiveToken } = require('../token/token')
const dayjs = require('dayjs')

class Check {
    constructor() {

    }
    async checkAdmin(req, res, next) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (token == 'undefined') {
                res.send({
                    status: 0,
                    type: 'ERROR_SESSION',
                    message: '您还没有登录',
                })
                return
            } else {
                verifyLoginToken(token, function callback(err, payload) {
                    if (err) {
                        res.status(401).send({
                            message: 'token无效'
                        })
                        return
                    }
                    const { exp, userEmail, userName } = payload
                    console.log(payload);
                    console.log('==========================payload');
                    console.log(dayjs(exp).format('YYYY-MM-DD HH:mm:ss'))
                    if (dayjs().isAfter(exp)) {
                        res.status(401).send({
                                message: "token过期"
                            }) // 过期，401提示客户端刷新token
                        return
                    } else {
                        // 否则通过验证
                        req.body.userInfo = { userEmail, userName }
                        next()
                    }
                })

            }
        } catch (error) {
            res.status(401).send({
                message: '重新登陆' + error
            })
        }

    }
    async checkRegister(req, res, next) {
        const { code, account } = req.params
        if (!code) {
            res.send({
                status: 404,
                message: "您还没有注册或修改了激活链接"
            })
            return
        } else {
            verifyActiveToken(code, account, adminModel)
        }
        next()
    }

}

module.exports = new Check()