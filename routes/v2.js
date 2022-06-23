const express = require('express')
const pages_JD = require('../controller/v2/pags_JD')
const pages_bk = require('../controller/v2/pags_BK')
const router = express.Router()

router.get('/goodsInfo', pages_JD.getgoodsInfo)
router.get('/getPagination', pages_JD.getPagination)
router.get('/houseInfo', pages_bk.gethouseInfo)
module.exports = router