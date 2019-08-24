var express = require('express');
var router = express.Router();
var Post = require('../../model/Post');
var CheckAuth = require('../middleware/check-auth');

router.get('/list',CheckAuth,function (req,res) {
  Post.find({}).populate('author').exec(function (err,rtn) {
    if(err){
      res.status(500).json({
        message:'Server Error',
        error:err
      })
    }else {
      if(rtn.length < 1){
        res.status(204).json({
          message:'No data found'
        })
      }else {
        res.status(200).json({
          posts:rtn
        })
      }
    }
  })
})

router.get('/detail/:id',CheckAuth,function (req,res) {
  Post.findById(req.params.id).populate('author').exec(function (err,rtn) {
    if(err){
      res.status(500).json({
        message:'Server Error',
        error: err
      })
    }else {
      if(rtn == null){
        res.status(204).json({
          message:'No Data Found'
        })
      }else {
        res.status(200).json({
          post:rtn
        })
      }
    }
  })
})

router.delete('/:id',CheckAuth,function (req,res) {
  Post.findByIdAndRemove(req.params.id,function (err,rtn) {
    if(err){
      res.status(500).json({
        message:'Server Error',
        error:err
      })
    }else {
      res.status(200).json({
        message:'Post deleted!!'
      })
    }
  })
})

router.post('/add',CheckAuth,function (req,res) {
  var post = new Post();
  post.title = req.body.title;
  post.content = req.body.content;
  post.author = req.body.author_id;
  post.save(function (err,rtn) {
    if(err){
      res.status(500).json({
        message:"Server Error",
        error:err
      })
    }else {
      res.status(201).json({
        message:"new post created"
      })
    }
  })
})

router.patch('/:id',CheckAuth,function (req,res) {
  var updateOps ={}

  for(var ops of req.body){
    updateOps[ops.proName] = ops.value
  }

  Post.findByIdAndUpdate(req.params.id,{$set:updateOps},function (err,rtn) {
    if(err){
      res.status(500).json({
        message:'Server Error',
        error:err
      })
    }else {
      res.status(200).json({
        message:'Post update successfull'
      })
    }
  })
})

module.exports = router
