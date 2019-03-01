const router = require('express').Router()
var fs = require('fs')
var multer = require('multer')
var upload = multer({dest: 'upload_tmp/'});

router.post('/upload', upload.any(), function(req, res) {
  var des_file = "./public/images/" + req.files[0].originalname;
  fs.readFile(req.files[0].path, function (err, data) {
      fs.writeFile(des_file, data, function (err) {
          if( err ){
              console.log( err );
          }else{
              response = {
                status: 200,
                message:'上传成功',
                url: '/images/' + req.files[0].originalname
              };
              res.send(response);
          }
      });
  });
})

module.exports = router