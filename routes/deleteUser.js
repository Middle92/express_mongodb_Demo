const express = require('express')
const router = express.Router()
const mongodb = require('mongodb')
const ObjectID = mongodb.ObjectID
const MongoClient = mongodb.MongoClient
const url = 'mongodb://127.0.0.1:27017'
const dbName = 'elemiao'

router.post('/system/deleteUser', function(req, res) {
  MongoClient.connect(url, function(err, client) {
    client.db(dbName).collection('user').remove({
      _id: ObjectID(req.body._id)
    }).then(result => {
      res.send({
        status: 200,
        message: '成功'
      })
    })
  })
})

module.exports = router