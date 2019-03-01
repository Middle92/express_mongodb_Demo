const express = require('express')
const router = express.Router()

const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'
const dbName = 'elemiao'

router.get('/getUserInfo', function(req, res) {
  // 数据库链接
  MongoClient.connect(url, function(err, client) {
    client.db(dbName).collection('user').findOne({
      username: req.query.username
    }).then(result => {
      if(result) {
        res.send({
          status: 200,
          message: '成功',
          data: Object.assign({
            avatar: 'https://wx1.sinaimg.cn/orj480/0079NFCjly8fwlf8ehdxij30ro0roabc.jpg',
            roles: result.power
          }, result)
        })
      }
    })
  })
  // res.send({
  //   status: 200,
  //   message: '成功',
  //   data: {
  //     avatar: 'https://wx1.sinaimg.cn/orj480/0079NFCjly8fwlf8ehdxij30ro0roabc.jpg',
  //     name: 'admin',
  //     roles: ['admin']
  //   }
  // })
})

module.exports = router