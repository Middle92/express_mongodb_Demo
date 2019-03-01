const router = require('express').Router()
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const url = 'mongodb://localhost:27017'
const dbName = 'elemiao'

router.post('/system/addUser', function(req, res) {
  MongoClient.connect(url, async function(err, client) {
    if (err) throw err;
    // 校验
    for (const key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        const element = req.body[key]
        if(!element || element.length <= 0) {
          res.send({
            status: 400,
            message: key + '不能为空'
          })
          return
        }
      }
    }
    if(req.body._id) {
      req.body._id = ObjectID(req.body._id)
      client.db(dbName).collection('user').save(req.body).then(result => {
        res.send({
          status: 200,
          message: '成功'
        })
      })
      return
    }
    // 查询数据库的username
    const username = await new Promise((resolve, reject) => {
      client.db(dbName).collection('user').find({username: req.body.username}).toArray(function(err, result) {
        if (err) throw err;
        if(result.length > 0) {
          res.send({
            status: 400,
            message: '用户已存在'
          })
          resolve(true)
          return
        }
        resolve(false)
      })
    }) 
    if(username) return 
    // 查询数据库的phone
    const phone = await new Promise((resolve, reject) => {
      client.db(dbName).collection('user').find({phone: req.body.phone}).toArray(function(err, result) {
        if (err) throw err;
        if(result.length > 0) {
          res.send({
            status: 400,
            message: '手机号码已存在'
          })
          resolve(true)
          return
        }
        resolve(false)
      })
    })
    if(phone) return

    await (function() {
      var data = Object.assign(req.body, {
        'date': new Date()
      })
      // 插入数据
      client.db(dbName).collection('user').insertOne(data, function(err, result) {
        if (err) throw err;
        res.send({
          status: 200,
          message: '添加成功'
        })
        client.close()
      })
    })()
  })
})

module.exports = router