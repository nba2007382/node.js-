const express = require('express')
const chart = require('../controller/chart/house')
const chart2 = require('../controller/chart/movie')
const router = express.Router()

router.get('/house', chart.housechart)
router.get('/movie', chart2.moviechart)

module.exports = router