var express = require('express');
var router = express.Router();
var User = require('../../model/User');
var multer = require('multer');
var upload = multer({ dest:'public/images/uploads'});
var bcrypt = require('bcrypt');
var CheckAuth = require('../middleware/check-auth');

router.get('/',function (req,res) {
  res.status(201).json({
    message:'User Home'
  })
})

router.get('/list',CheckAuth,function (req,res) {
  User.find({},function (err,rtn) {
    if(err){
      res.status(500).json({
        message: 'Server Error',
        error: err
      })
    }
    console.log(rtn);
    if(rtn.length < 1){
      res.status(204).json({
        message:'No data found!'
      })
    }else {
      res.status(200).json({
        users:rtn
      })
    }
  })
})

router.get('/detail/:id',CheckAuth,function (req,res) {
  User.findById(req.params.id,function (err,rtn) {
    if(err){
      res.status(500).json({
        message:'Server Error',
        error:err
      })
    }else {
      if(rtn == null){
        res.status(204).json({
          message:'Not Content Found'
        })
      }else {
        res.status(200).json({
          user:rtn
        })
      }
    }
  })
})

router.delete('/:id',function (req,res) {
  User.findByIdAndRemove(req.params.id,function (err,rtn) {
    if(err){
      res.status(500).json({
        message:'Server Error'
      })
    }else {
      res.status(200).json({
        message:'User Deleted'
      })
    }
  })
})

router.post('/add',upload.single('photo'),CheckAuth,function (req,res) {
  var user = new User();
  user.name  = req.body.name;
  user.email = req.body.email;
  user.password = req.body.pwd;
  if(req.file) user.imgUrl = '/images/uploads/'+req.file.filename;
  User.findOne({email:req.body.email},function (err2,rtn2) {
    if(err2){
      res.status(500).json({
        message:'Server Error',
        error:err2
      })
    }else {
      if(rtn2 == null){
        user.save(function (err,rtn) {
          if(err){
              res.status(500).json({
                message:'Server Error',
                error:err
              })
          }else {
            res.status(201).json({
              message:'User Account created'
            })
          }

        });
      }else {
        res.status(409).json({
          message:'Email is Already exist'
        })
      }
    }
  })

})

router.patch('/:id',CheckAuth,function (req,res) {
  var updateOps ={}

  for(var ops of req.body){
    updateOps[ops.proName] =(ops.proName != 'password')? ops.value:bcrypt.hashSync(ops.value,bcrypt.genSaltSync(8),null)
  }
  User.findByIdAndUpdate(req.params.id,{$set:updateOps},function (err,rtn) {
    if(err){
      res.status(500).json({
        message:'Server Error',
        error: err
      })
    }else {
      res.status(200).json({
        message:'User Account Modified'
      })
    }
  })
})

module.exports = router;
