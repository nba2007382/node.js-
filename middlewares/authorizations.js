const { verifyRefreshLoginToken, addLoginToken } = require('../token/token')
const dayjs = require('dayjs')


class authorization {
    async refreshToken(req, res, next) {
        try {

            const token = req.headers.authorization.split(' ')[1]
            console.log(token);
            verifyRefreshLoginToken(token, function callback(err, payload) {
                if (err) {
                    res.status(403).send({
                        message: '您的refreshToken验证错误'
                    })
                    return
                }
                const { userEmail, userName, exp } = payload
                console.log('11111111111111111111111111111111111111111');
                console.log(payload);
                console.log(dayjs(exp).format('YYYY-MM-DD HH:mm:ss'))
                if (dayjs().isAfter(exp)) {
                    res.status(403).send({
                        message: '您的登入过时，请重新登入'
                    })
                    return
                }
                console.log('================================================================');
                console.log(userEmail);
                console.log(userName);

                res.status(200).send({
                    access_token: addLoginToken({ name: userName, email: userEmail }),
                    refresh_token: token,
                    message: '刷新成功'
                })
                return
            })
        } catch (error) {
            res.status(403).send({
                message: '刷新失败' + error
            })
        }
    }
}
module.exports = new authorization()