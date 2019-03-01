const express = require('express')
const router = express.Router()
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID
const url = 'mongodb://127.0.0.1:27017'
const dbName = 'elemiao'
const xlsx = require('node-xlsx')
const fs = require('fs')

router.post('/exportFile', (req, res) => {
  let userID = req.body.map((element) => {
    return {"_id": ObjectID(element)}
  })
  MongoClient.connect(url, (err, client) => {
    client.db(dbName).collection('user').find({
      $or: userID
    }).toArray((err, result) => {
      let header = ['用户名', '密码', '手机号码', '真实姓名', '权限', '头像']
      let body = result.map((element) => {
        return [element['username'], element['password'], element['phone'], element['name'], element['power'].join(','), element['avatar']]
      })
      let data = [header, ...body]
      let buffer = xlsx.build([{name: '用户', data: data}])
      
      let fileName = new Date().getTime() +  '.xlsx'
      fs.writeFile('./public/files/' + fileName, buffer, (err) => {
        if (err) {
          console.log(err)
        } else {
          res.send({
            status: 200,
            path: '/files/' + fileName
          })
        }
      })
    })
  })
})

module.exports = router