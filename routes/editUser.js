const router = require('express').Router()
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const url = 'mongodb://127.0.0.1:27017'
const dbName = 'elemiao'

router.post('/system/editUser', function(req, res) {
  MongoClient.connect(url, function(err, client) {
    req.body._id = ObjectID(req.body._id)
    client.db(dbName).collection('user').save(req.body).then(function(result) {
      res.end({
        status: 200,
        message: '成功'
      })
    })
  })
})

module.exports = router