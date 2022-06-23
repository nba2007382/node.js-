const schedule = require('node-schedule');
const monito_BeiKe = require('../models/monito/BeiKe')
const monito_JD = require('../models/monito/JD')
const monito_WeiBo = require('../models/monito/WeiBo')
const unpricehouse = require('../models/house/unprice')
const house = require('../models/house/house')
const movie = require('../models/movie/movie')
const controlEmail = require('./email')
    // 生成新的定时任务
let interval = async(options) => {
        return new Promise((resolve) => {
            // 终止之前的定时任务
            editMaintainTime(options)
                // 按照固定格式，设定定时任务，这里使用每条数据的唯一字段+定时任务时间，作为任务名称
                // 任务名称就是'名字_2020-6-22'
                // 任务时间就是'1-2 1 1 22 6 *' ，意思是每年的6月22日的1点1分的1秒~10秒触发，触发10次
            schedule.scheduleJob(`${options.unit_name}`, `${options.maintain_time}`, async() => {
                console.log('任务进行中')

                // 写入你自己想在定时任务触发的时候，想要执行的函数
                let JD;
                let BeiKe;
                let befor_wb = await monito_WeiBo.find({})
                let end_wb;
                await Promise.all([monito_JD.updatagoods(), monito_BeiKe.updatahouse(), monito_WeiBo.updataWB(), house.updata()])
                await Promise.all([monito_JD.find({}), monito_BeiKe.find({}), monito_WeiBo.find({})]).then((res) => {
                    JD = res[0]
                    BeiKe = res[1]
                    end_wb = res[2]
                    return
                })
                await Promise.all([talkJD(), talkBK(), talkWB()])
                await Promise.all([movie.updata(), unpricehouse.updata()])
                resolve(1)
                return

                function talkJD() {
                    return new Promise((resolve, rejects) => {
                        try {
                            console.log('talkJD开始');
                            for (let i = 0; i < JD.length; i++) {
                                const el = JD[i];
                                if (el.price[el.price.length - 2] !== el.price[el.price.length - 1]) {
                                    const difference = el.price[el.price.length - 1] - el.price[el.price.length - 2]
                                    const subject = '您添加的京东商品价格有变动'
                                    const content = difference < 0 ? "<div>商品：" + el.title + " 今天已经降价" + Math.abs(difference) + "元<a>" + el.href + "<a/><div/>" :
                                        "<div>商品：" + el.title + " 今天已经涨价" + Math.abs(difference) + "元<a>" + el.href + "<a/><div/>"
                                    controlEmail.sendEmail({ to: el.from, content, subject })
                                }
                            }
                            console.log('talkJD完毕');
                            resolve(1)
                            return
                        } catch (error) {
                            console.log('talkJD识别' + error);
                            rejects(error)
                            return
                        }

                    })
                }

                function talkBK() {
                    return new Promise((resolve, rejects) => {
                        try {
                            console.log('talkBK开始');
                            for (let i = 0; i < BeiKe.length; i++) {
                                const el = BeiKe[i];
                                if (el.price[el.price.length - 2] !== el.price[el.price.length - 1]) {
                                    const difference = el.price[el.price.length - 1] - el.price[el.price.length - 2]
                                    const subject = '您添加的贝壳二手房价格有变动'
                                    const content = difference < 0 ? "<div>贝壳二手房：" + el.title + " 今天已经降价" + Math.abs(difference) + "元<a>" + el.href + "<a/><div/>" :
                                        "<div>贝壳二手房：" + el.title + " 今天已经涨价" + Math.abs(difference) + "元<a>" + el.href + "<a/><div/>"
                                    controlEmail.sendEmail({ to: el.from, content, subject })
                                }
                            }
                            console.log('talkBK完毕');
                            resolve(1)
                            return
                        } catch (error) {
                            console.log('talkBK识别' + error);
                            rejects(error)
                            return
                        }

                    })
                }

                function talkWB() {
                    return new Promise((resolve, rejects) => {
                        try {
                            console.log('talkWB开始');
                            for (let i = 0; i < befor_wb.length; i++) {
                                const el = befor_wb[i];
                                if (el.content.length < end_wb[i].content.length) {
                                    const user = el.user.screen_name
                                    const subject = '您关注的微博用户:' + user + '发了新微博'
                                    const content = '您关注的微博用户:' + user + '发了新微博'
                                    controlEmail.sendEmail({ to: el.from, content, subject })
                                }
                            }
                            console.log('talkWB完毕');
                            resolve(1)
                            return
                        } catch (error) {
                            console.log('talkWB识别' + error);
                            rejects(error)
                            return
                        }
                    })
                }

            })
        })
    }
    // 删除定时任务
const editMaintainTime = async(options) => {
    console.log('options', options)

    // 查看所有的定时任务
    for (let i in schedule.scheduledJobs) {
        console.error("任务删除前：" + i);
    }
    // 终止之前的定时任务
    console.log('终止的任务', `${options.alarm14}`)
    if (schedule.scheduledJobs[`${options.alarm14}`]) {
        schedule.scheduledJobs[`${options.alarm14}`].cancel();
    }

    // 查看剩下的定时任务
    for (let i in schedule.scheduledJobs) {
        console.error("任务删除后：" + i);
    }
    // time.cancel()

    console.log('删除成功')
}


// 时间选择

const intervalControl = {
    interval: interval
}

module.exports = intervalControl