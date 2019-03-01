const router = require('express').Router()
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'
const dbName = 'elemiao'

router.post('/system/getUser', function(req, res) {
  MongoClient.connect(url, (err, client) => {
    if(err) throw err
    // 模糊查询
    client.db(dbName).collection('user').find({
      username: {$regex: req.body.username || '', $options: 'imxs'},
      phone: {$regex: req.body.phone || '', $options: 'imxs'},
      power: {$regex: req.body.power.join('|'), $options: 'imxs'},
      name: {$regex: req.body.name || '', $options: 'imxs'}
    }).toArray((err, result) => {
      if(err) throw err
      res.send({
        status: 200,
        message: '成功',
        data: result.slice((req.body.currentPage - 1) * req.body.pageSize, req.body.currentPage * req.body.pageSize),
        currentPage: req.body.currentPage,
        pageSize: req.body.pageSize,
        total: result.length
      })
      client.close()
    })
  })
})

module.exports = router