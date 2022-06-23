const express = require('express')
const check = require('../middlewares/check')
const router = express.Router()

router.get('/login', check.checkAdmin)

module.exports = router