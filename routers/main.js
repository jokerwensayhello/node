const express = require('express');
const Router = express.Router();
const Category = require('../models/Category');

Router.get('/',function(req,res,next){
    Category.find().then((categories)=>{
        res.render('pages/index',{
            userInfo: req.userInfo,
            categories: categories,
        }); 
    })

    
    
})

module.exports = Router;