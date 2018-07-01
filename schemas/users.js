const mongoose = require('mongoose');
// 表结构
module.exports = new mongoose.Schema({
    // 用户名 密码 是否为管理员
    username: String,
    password: String,
    isAdmin:{
        type: Boolean,
        default: false,
    }
})