const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
        user: '1143571151@qq.com',
        pass: 'ssthhxznovshhbac' //anzjtdlmvpuvbcjc.pmoayaasziaebcfj
    }
})
const controlEmail = {

    sendEmail({ to, subject, content }) {
        const options = {
            to,
            subject,
            content,
        }
        const mailOptions = {
            from: '1143571151@qq.com',
            to: options.to, //发给谁
            subject: options.subject, //标题
            html: options.content //内容
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('邮件发送成功 ID:' + mailOptions.to, info.messageId);
        });
    }
}

module.exports = controlEmail