/**
 * 应用程序的入口文件
 */

//  加载express模块
const express = require('express');
//  加载swig 模板引擎
const swig = require('swig');
// 创建app应用 => NodeJS Http.createServer();
const app = express();
// 加载数据库模块
const mongoose = require('mongoose');
// 加载body-parser模块
const bodyParser = require('body-parser');
// 加载cookies模块
const Cookies = require('cookies');

// 静态文件托管
app.use('/public',express.static(__dirname+'/public'))
// 设置body-parser
app.use(bodyParser.urlencoded({extended: true}));
// 设置cookies
app.use((req,res,next) => {
    req.cookies = new Cookies(req,res);
    req.userInfo = {};
    if(req.cookies.get('userInfo')){
        try{
            req.userInfo = JSON.parse(req.cookies.get('userInfo'))
        }catch(e){

        }
    }
    next();
});



/**
 * 第一个参数为模板文件后缀，第二个参数表示解析处理模板内容的方法
 */
app.engine('html',swig.renderFile);
// 设置模板文件存放的目录,第一个参数必须是views,第二个参数是路径
app.set('views','./views');
// 注册所使用的模板引擎，第一个参数必须是 view engine,第二个参数和app.engine的一个参数一致; 
app.set('view engine','html');
// 开发过程中需要取消swig模板自带的缓存
swig.setDefaults({cache: false});



/**
 * 根据不同功能划分模块
 */
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));



// 监听http请求
mongoose.connect('mongodb://localhost:27018/blog',function(err){
    if(err){
        console.log("数据库链接失败")
    }else {
        console.log("数据库链接成功");
        app.listen(3300);
    }
});
