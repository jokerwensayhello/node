const express = require('express');
const Router = express.Router();
const User = require('../models/User');
const Category = require('../models/Category');
const Content = require('../models/Content');

Router.use((req, res, next) => {
    if (!req.userInfo.user.isAdmin) {
        res.send("对不起，只有管理员才能进入后台管理!");
        return;
    }
    next();
});
// 后台首页
Router.get('/', (req, res, next) => {
    res.render('admin/index', {
        userInfo: req.userInfo,
    })
});
// 用户管理
Router.get('/users', (req, res, next) => {
    /**
     * 读取数据库
     *  limit(number) 限制获取数据的最大条数;
     * skip(number) 忽略数据的条数；
     * 
     * 
     */
    let page = req.query.page || 1;
    let limit = 10;
    let pages = 0;
    let totalUsers = [];

    User.count().then((countNumber) => {

        pages = Math.ceil(countNumber / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        totalUsers.length = pages;

        let skip = (page - 1) * limit;
        User.find().limit(limit).skip(skip).then((users) => {
            res.render('admin/users', {
                userInfo: req.userInfo,
                users: users,
                page: page,
                pages: pages,
                totalUsers: totalUsers,
                total: countNumber,
                limit: limit,

            });
            console.log(totalUsers)
        });
    })
});
// 分类首页
Router.get('/category', (req, res, next) => {
    /**
     * 读取数据库
     *  limit(number) 限制获取数据的最大条数;
     * skip(number) 忽略数据的条数；
     * 
     * 
     */
    let page = req.query.page || 1;
    let limit = 10;
    let pages = 0;
    let totalUsers = [];

    Category.count().then((countNumber) => {

        pages = Math.ceil(countNumber / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        totalUsers.length = pages;

        let skip = (page - 1) * limit;
        Category.find().limit(limit).skip(skip).then((categories) => {
            res.render('admin/category', {
                userInfo: req.userInfo,
                categories: categories,
                page: page,
                pages: pages,
                totalUsers: totalUsers,
                total: countNumber,
                limit: limit,
            });

        });
    })
});
// 分类添加
Router.get('/category/add', (req, res, next) => {
    res.render('admin/category_add', {
        userInfo: req.userInfo,
    })
});
// 分类添加
Router.post('/category/add', (req, res, next) => {

    let category_name = req.body.category_name.replace(/(^\s+)|(\s+$)/g, '') || '';

    if (category_name == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            err_message: '名称不能为空',
        });
        return;
    }
    // 查询数据库
    Category.findOne({
        category_name: category_name
    }).then((categoryInfo) => {
        if (categoryInfo) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                err_message: '分类已经存在'
            });
            return Promise.reject();//切断Promise链
        } else {
            return new Category({
                category_name: category_name
            }).save();
        }
    }).then((newCategory) => {
        res.render('admin/success', {
            userInfo: req.userInfo,
            suc_message: '分类添加成功',
            url: '/admin/category'
        });
    })
});
// 分类修改
Router.get('/category/edit', (req, res, next) => {
    let id = req.query.id || '';

    Category.findOne({
        _id: id
    }).then((categoryInfo) => {
        if (!categoryInfo) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                err_message: '该分类不存在',
            });
            return Promise.reject();
        } else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                categoryInfo: categoryInfo,
            });
        }
    })


})
// 分类修改请求
Router.post('/category/edit', (req, res, next) => {
    let id = req.query.id || '';//参数id
    let category_name = req.body.category_name || '';//提交的分类名称

    Category.findOne({
        _id: id
    }).then((categoryInfo) => {
        if (!categoryInfo) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                err_message: '该分类不存在',
                url: '/admin/category'
            });
            return Promise.reject();
        } else {
            if (category_name == categoryInfo.category_name) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    suc_message: '分类修改成功',
                    url: '/admin/category'
                });
                return Promise.reject();
            } else {
                // 查询修改后的分类名称是否与数据库中的分类名称相同;
                return Category.findOne({
                    _id: { $ne: id },
                    category_name: category_name,
                });
            }
        }
    }).then((sameCategory) => {
        if (sameCategory) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                err_message: '该分类名称已存在',
            });
            return Promise.reject();
        } else {
            return Category.update({
                _id: id,
            },{
                category_name: category_name
            });
        }
    }).then(() => {
        res.render('admin/success', {
            userInfo: req.userInfo,
            suc_message: '分类修改成功',
            url: '/admin/category'
        });
    })


})
// 分类删除请求
Router.get('/category/delet', (req,res, next) => {
    let id = req.query.id || '';
    Category.remove({
        _id: id,
    }).then(() => {
        res.render('admin/success', {
            userInfo: req.userInfo,
            suc_message: '分类删除成功',
            url: '/admin/category'
        });
    });

})
// 内容首页
Router.get('/content', (req,res,next) => {
    /**
     * 读取数据库
     *  limit(number) 限制获取数据的最大条数;
     * skip(number) 忽略数据的条数；
     * 
     * 
     */
    let page = req.query.page || 1;
    let limit = 10;
    let pages = 0;
    let totalUsers = [];

    Content.count().then((countNumber) => {

        pages = Math.ceil(countNumber / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        totalUsers.length = pages;

        let skip = (page - 1) * limit;
        Content.find().limit(limit).skip(skip).populate('category_id').then((contents) => {
            
            res.render('admin/content', {
                userInfo: req.userInfo,
                contents: contents,
                page: page,
                pages: pages,
                totalUsers: totalUsers,
                total: countNumber,
                limit: limit,
            });

        });
    })
    
});
// 内容添加
Router.get('/content/add', (req,res,next) => {
    Category.find().then((categories) => {
        console.log(categories)
        res.render('admin/content_add',{
            userInfo: req.userInfo,
            categories: categories,
        })
    })
});
// // 内容 -> 保存
Router.post('/content/add', (req,res,next) => {
    let category_id = req.body.category_id;
    let title = req.body.title;
    let description = req.body.description;
    let content = req.body.content;


    if(title  == '' ){
        res.render('admin/error', {
            userInfo: req.userInfo,
            err_message: '内容标题不能为空'
        });
        return ;
    }

    new Content({
        category_id: category_id,
        title: title,
        description: description,
        content: content
    }).save().then((contentInfo) => {
        res.render('admin/success', {
            userInfo: req.userInfo,
            suc_message: '保存成功',
            url: '/admin/content'
        });
        
    })
});
// // 内容 -> 修改
Router.get('/content/edit', (req, res, next) => {
    let id = req.query.id || '';
    let categories = [];
    Category.find().then((rs) => {
        categories = rs;
        return Content.findOne({
            _id: id
        }).populate('categories');
        
    }).then((contentInfo) => {
        if (!contentInfo) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                err_message: '该内容不存在',
            });
            return Promise.reject();
        } else {
            console.log(contentInfo)
            res.render('admin/content_edit', {
                userInfo: req.userInfo,
                contentInfo: contentInfo,
                categories: categories,
            });            
        }
    })

    


})

module.exports = Router;