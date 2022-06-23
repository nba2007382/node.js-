const adminModel = require('../../models/admin/admin')
const { addActiveToken, addLoginToken, addRefreshLoginToken, verifyActiveToken } = require('../../token/token')
const controlEmail = require('../../schedule/email')
class admin {
    async activeEmail(req, res, next) {
        try {
            const { code, account } = req.query
            console.log(code);
            if (!code || !account) {
                res.send({
                    status: 403,
                    message: '链接异常'
                })
                return
            }
            verifyActiveToken(res, code, account, adminModel)
            return
        } catch (err) {
            res.send({
                message: '激活出错' + err
            })
        }
    }
    async register(req, res, next) {
        try {
            const { user_email, user_name, user_password } = req.body
            console.log(user_email, user_name, user_password);
            const user = await adminModel.find({ email: user_email });
            console.log(user); //验证用户是否已注册
            if (user.length !== 0) {
                if (user[0].status == 0) {
                    const subject = '重新激活邮箱'
                    const emailContent = '<div><a>http://localhost:8000/admin/register/active?code=' + addActiveToken(user_email) + "&account=" + user_email + "</a></div>"
                    controlEmail.sendEmail({ to: user_email, content: emailContent, subject })
                    res.send({
                        status: 10002,
                        message: '邮箱已经注册但还未激活，已重新发送邮件到您的邮箱请前往邮箱激活'
                    })
                    return
                }
                if (user[0].status == 1) {
                    console.log(11111);
                    res.send({
                        status: 10002,
                        message: '邮箱已经注册'
                    })
                    return
                }
            }
            //用户参数

            const userInfo = {
                email: user_email,
                name: user_name,
                password: user_password,
                status: 0,
                create_time: Date.now('YYYY-MM-DD')
            };
            //新建用户
            console.log("newGuess.save userInfo-->" + JSON.stringify(userInfo));
            try {
                await adminModel.insertMany(userInfo)
                const useremail = userInfo.email
                const code = addActiveToken(useremail)
                const emailContent = '<div><a>http://localhost:8000/admin/register/active?code=' + code + "&account=" + useremail + "</a></div>"
                console.log('11111');
                const subject = '邮箱注册激活'
                controlEmail.sendEmail({ to: useremail, content: emailContent, subject })
                res.send({
                    message: "新用户注册成功 and 激活邮箱发送成功"
                })
            } catch (error) {
                res.send({
                    status: '00001',
                    message: '数据库出错' + error
                })
            }
        } catch (error) {
            //错误处理
            res.send({
                message: error + ''
            })
        }
    }
    async login(req, res, next) {
        try {
            const { user_email, user_password, user_remember } = req.body
            const user = await adminModel.find({ email: user_email })
            if (user.length == 0) {
                res.send({
                    status: 10001,
                    message: '没有找到邮箱，邮箱可能还没注册'
                })
                return
            } else if (user[0].password !== user_password) {
                res.send({
                    status: 10002,
                    message: '密码错误'
                })
                return
            }
            const token = addLoginToken({ name: user[0].name, email: user[0].email })
            const { username } = user[0]
            console.log(username);
            console.log(user[0].name, user[0].email);
            if (!user_remember) {
                res.send({
                    status: 200,
                    message: '登入成功',
                    access_token: token,
                    userInfo: { name: user[0].name, email: user[0].email }
                })
                return
            } else {
                const refresh = addRefreshLoginToken({ name: user[0].name, email: user[0].email, id: user[0]._id })
                res.send({
                    status: 200,
                    message: '登入成功，已记住您',
                    access_token: token,
                    refresh_token: refresh,
                    userInfo: { name: user[0].name, email: user[0].email }
                })
                return
            }
        } catch (errors) {
            res.send({
                status: 403,
                message: '登入失败' + errors
            })
            return
        }
    }

    async deladmin() {

    }
}

module.exports = new admin()