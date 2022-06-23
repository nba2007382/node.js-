const house = require('../../models/house/house')
const movie = require('../../models/movie/movie')
class list {
    async gethouselist(req, res, next) {
        const list = await house.aggregate([{ $sample: { size: 4 } }])
        try {
            if (!list) {
                throw new Error('数据库里没有数据')
            } else {
                res.send({
                    status: 1,
                    data: list
                })
            }
        } catch (error) {
            console.log('获取房子列表失败');
            res.send({
                status: 1,
                type: 'Get_HouseData_Failed',
                message: '获取房子列表失败'
            })
        }
    }
    async getmovielist(req, res, next) {
        const list = await movie.aggregate([{ $sample: { size: 4 } }])

        try {
            if (!list) {
                throw new Error('数据库里没有数据')
            } else {
                res.send({
                    status: 1,
                    data: list
                })
            }
        } catch (error) {
            console.log('获取电影列表失败');
            res.send({
                status: 1,
                type: 'Get_HouseData_Failed',
                message: '获取电影列表失败'
            })
        }
    }
}
module.exports = new list()