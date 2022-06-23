const movie = require('../../models/movie/movie')

class chart {
    async moviechart(req, res, next) {
        let chart1 = await movie.aggregate([{ $unwind: '$tag' }, { $group: { _id: '$tag', unrate: { $avg: { $toDouble: '$rate' } } } }, { $group: { _id: 0, name: { $addToSet: '$_id' }, unrate: { $addToSet: '$unrate' } } }])
        let chart2 = await movie.aggregate([{
            $addFields: {
                Rate: { $toDouble: '$rate' }
            }
        }, {
            $facet: {
                eu: [{ $match: { tag: '欧美' } }, {
                    $bucket: {
                        groupBy: '$Rate',
                        boundaries: [9, 9.2, 9.4, 9.6, 9.8, 10],
                        default: 'Other',
                        output: {
                            'count': { $sum: 1 }
                        }
                    }
                }, { $match: { _id: { $ne: 'Other' } } }, {
                    $group: {
                        _id: 0,
                        rate: { $push: '$count' },
                        xname: { $push: '$_id' }
                    }
                }, {
                    $project: {
                        name: '欧美',
                        rate: '$rate',
                        xname: '$xname'
                    }
                }],
                jp: [{ $match: { tag: '日本' } }, {
                    $bucket: {
                        groupBy: { $toDouble: '$Rate' },
                        boundaries: [9, 9.2, 9.4, 9.6, 9.8, 10],
                        default: 'Other',
                        output: {
                            'count': { $sum: 1 }
                        }
                    }
                }, { $match: { _id: { $ne: 'Other' } } }, {
                    $group: {
                        _id: 0,
                        rate: { $push: '$count' },
                        xname: { $push: '$_id' }
                    }
                }, {
                    $project: {
                        name: '日本',
                        rate: '$rate',
                        xname: '$xname'
                    }
                }],
                us: [{ $match: { tag: '美国' } }, {
                    $bucket: {
                        groupBy: { $toDouble: '$Rate' },
                        boundaries: [9, 9.2, 9.4, 9.6, 9.8, 10],
                        default: 'Other',
                        output: {
                            'count': { $sum: 1 }
                        }
                    }
                }, { $match: { _id: { $ne: 'Other' } } }, {
                    $group: {
                        _id: 0,
                        rate: { $push: '$count' },
                        xname: { $push: '$_id' }
                    }
                }, {
                    $project: {
                        name: '美国',
                        rate: '$rate',
                        xname: '$xname'
                    }
                }]
            }
        }])
        chart2 = [{
            name: chart2[0].eu[0].name,
            rate: chart2[0].eu[0].rate,
            xname: chart2[0].eu[0].xname
        }, {
            name: chart2[0].jp[0].name,
            rate: chart2[0].jp[0].rate,
            xname: chart2[0].jp[0].xname

        }, {
            name: chart2[0].us[0].name,
            rate: chart2[0].us[0].rate,
            xname: chart2[0].us[0].xname

        }]
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