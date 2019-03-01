const express = require('express')
const router = express.Router()

router.post('/logout', function(req, res) {
  res.send({
    status: 200,
    message: '退出登录成功'
  })
})

module.exports = router