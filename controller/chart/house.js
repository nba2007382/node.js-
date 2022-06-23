const house = require('../../models/house/house')
const unPrice = require('../../models/house/unprice')

class chart {
    async housechart(req, res, next) {
        let chart1 = await unPrice.aggregate([{ $sort: { 'create_time': -1 } }, { $limit: 3 }, { $sort: { 'name': -1 } }, {
            $group: { _id: 0, name: { $push: '$name' }, unprice: { $push: '$untiprice' } }
        }])
        let chart2 = await unPrice.aggregate([{ $sort: { "create_time": 1 } }, { $limit: 21 }, { $sort: { 'name': -1 } }, {
            $group: { _id: '$name', unprice: { $push: '$untiprice' }, time: { $push: '$create_time' } }
        }, {
            $project: {
                name: '$_id',
                time: '$time',
                unprice: "$unprice",
                _id: 0
            }
        }])
        try {
            if (!chart) {
                throw new Error('图表获取为空')
            } else {
                res.send({
                    status: 1,
                    data: { chart1, chart2 }
                })
            }
        } catch (error) {
            console.log('获取图表失败');
            res.send({
                status: 1,
                type: 'Get_HouseData_Failed',
                message: '获取图表失败'
            })
        }
    }
}

module.exports = new chart()