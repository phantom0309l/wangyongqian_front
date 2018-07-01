'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');
if (process.env.DEV_USER == undefined) {
    throw new Error("请配置环境变量 DEV_USER")
}
if (process.env.VUE_HOST == undefined) {
    throw new Error("请配置环境变量 VUE_HOST")
}

//此处是给业务代码使用的
module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    DEV_USER: JSON.stringify(process.env.DEV_USER),
    VUE_HOST: JSON.stringify(process.env.VUE_HOST)
});
