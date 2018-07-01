const express = require('express');
const Router = express.Router();
const User = require('../models/User')

let responseData;
Router.use( function(req,res,next){
    responseData = {
        code: 0,
        message: ''
    }
    next();
})
/**
 * 用户注册
 *  注册逻辑
 *  1，用户名不能为空
 *  2，密码不能为空
 *  3，两次输入密码必须一致
 *  4，用户是否已经被注册（数据库查询）
 */
Router.post('/user/register',function(req,res,next){
    let username = req.body.username;
    let password = req.body.password;
    let repassword = req.body.repassword;

    if(username == ''){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
    if(password == ''){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    if(password != repassword){
        responseData.code = 3;
        responseData.message = '两次密码不一致';
        res.json(responseData);
        return;
    }
    // 查询数据库

    User.findOne({
        username: username,
    }).then((userInfo)=>{
        if(userInfo){
            responseData.code = 4;
            responseData.message = '用户名已注册';
            res.json(responseData);
            return;
        }
        let user = new User({
            username: username,
            password: password,
        })
        return user.save();
    }).then((newUserInfo)=>{
        responseData.message = '注册成功';
        res.json(responseData);
    })


    
    
});
/**
 * 用户登陆
 */
Router.post('/user/login',(req,res,next)=>{
    let username = req.body.username;
    let password = req.body.password;

    if(username == '' || password == ''){
        responseData.code = 1;
        responseData.message = '用户名或密码不能为空';
        res.json(responseData);
        return ;
    }

    // 查询数据库

    User.findOne({
        username: username,
        password: password
    }).then((userInfo) => {
        if(!userInfo){
            responseData.code = 2;
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return ;
        }
        responseData.message = '登陆成功';
        responseData.data = {
            user:{
                id: userInfo.id,
                username: userInfo.username,
            }
        }
        // 存入cookies
        req.cookies.set('userInfo',JSON.stringify({
            user:{
                id: userInfo.id,
                username: userInfo.username,
                isAdmin: userInfo.isAdmin,
            }
        }));
        res.json(responseData);
        return ;
    })
})
/**
 * 用户退出登陆
 */
Router.get('/user/logout',(req,res,next)=>{
    req.cookies.set('userInfo', null);//清除缓存用户信息
    res.json(responseData);
    return ;
})
module.exports = Router;