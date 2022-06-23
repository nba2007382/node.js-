const mongoose = require('mongoose')
const house = require('./house')
const Schema = mongoose.Schema
const dayjs = require('dayjs')
const unpricehouseData = new Schema({
    name: String,
    untiprice: Number,
    create_time: {
        type: Number,
        index: true
    }
})
unpricehouseData.statics.updata = async function() {
    try {
        console.log('正在更新贝壳均价');
        const houseList = await house.aggregate([{
            $group: {
                _id: "$name",
                untiprice: { $avg: "$untiprice" }
            }
        }, {
            $project: {
                _id: 0,
                name: "$_id",
                untiprice: "$untiprice",
                create_time: dayjs(new Date()).format('YYYYMMDD')
            }
        }])

        await unpricehouse.insertMany(houseList)
        console.log('正在更新贝壳均价完毕');
        return
    } catch (error) {
        console.log(error + '贝壳均价更新失败');
    }

}
const unpricehouse = mongoose.model('unpricehouse', unpricehouseData)


module.exports = unpricehouse