const mongoose = require('mongoose');
// 表结构
module.exports = new mongoose.Schema({
    //分类id
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    // 标题
    title: String,
    // 简介
    description: {
        type: String,
        default: '',
    },
    content: {
        type: String,
        default: '',
    }
})