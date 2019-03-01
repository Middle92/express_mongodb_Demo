const express = require('express')
const router = express.Router()

const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'
const dbName = 'elemiao'


router.post('/login', function(req, res) {
  /**
   * username
   * password
   */
  if(!req.body.username) {
    res.send({
      status: 400,
      message: '请输入账号'
    })
    return 
  } else if(!req.body.password) {
    res.send({
      status: 400,
      message: '请输入密码'
    })
    return 
  }
  MongoClient.connect(url, function(err, client) {
    client.db(dbName).collection('user').findOne({
      username: req.body.username,
      password: req.body.password
    }).then(function(result) {
      if(result) {
        global.userInfo = result
        res.send({
          status: 200,
          message: '登陆成功',
          data: {
            token: 'token',
            result
          }
        })
      } else {
        res.send({
          status: 400,
          message: '密码账号错误'
        })
      }
      client.close()
    })
  })
  
  
})

module.exports = router