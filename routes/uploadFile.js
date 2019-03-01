const express = require('express')
const router = express.Router()
const multer = require('multer')
const uploadFile = multer({dest: 'uploadFile_tmp/'})
const fs = require('fs')
const xlsx = require('node-xlsx')
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const url = 'mongodb://localhost:27017'
const dbName = 'elemiao'

router.post('/uploadFile', uploadFile.any(), (req, res) => {
  let des_file = './public/files/' + req.files[0].originalname
  fs.readFile(req.files[0].path, (err, data) => {
    fs.writeFile(des_file, data, (err) => {
      if( err ){
        console.log( err );
      }else{
        let obj = xlsx.parse('./public/files/' + req.files[0].originalname)
        fileData = JSON.parse(JSON.stringify(obj))
        let importArr = []
        fileData.forEach(element => {
          let username = element.data[0].indexOf('用户名')
          let password = element.data[0].indexOf('密码')
          let phone = element.data[0].indexOf('手机号码')
          let name = element.data[0].indexOf('真实姓名')
          let power = element.data[0].indexOf('权限')
          let avatar = element.data[0].indexOf('上传头像')
          element.data.splice(1).forEach(element2 => {
            importArr.push({
              username: element2[username].toString(),
              password: element2[password].toString(),
              phone:    element2[phone].toString(),
              name:     element2[name].toString(),
              power:    element2[power].split(','),
              avatar:   element2[avatar] || '',
              date:     new Date()
            })
          })
        })
        MongoClient.connect(url, (err, client) => {
          client.db(dbName).collection('user').insert(importArr).then(result => {
            response = {
              status: 200,
              message:'上传成功',
              url: '/files/' + req.files[0].originalname
            };
            res.send(response);
          })
        })
      }
    })
  })
})

module.exports = router