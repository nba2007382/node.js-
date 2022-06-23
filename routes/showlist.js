const express = require('express')
const list = require('../controller/v1/house')
const router = express.Router()

router.get('/house', list.gethouselist)
router.get('/movie', list.getmovielist)

module.exports = router