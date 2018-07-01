<template>
    <div class="login">
        <div class="logo-box">
            <img src="../../static/image/logo.png" width="100px">
        </div>
        <div>
            <!--<div>-->
            <!--<el-input placeholder="请输入手机号" v-model="form.mobile">-->
            <!--<template slot="prepend">+ 86</template>-->
            <!--</el-input>-->
            <!--</div>-->
            <div class="push-10-b">
                <el-input placeholder="请输入账号" v-model="username">
                    <template slot="prepend">账号</template>
                </el-input>
            </div>
            <div class="push-20-b">
                <el-input placeholder="请输入密码" type="password" v-model="password">
                    <template slot="prepend">密码</template>
                </el-input>
            </div>
            <div>
                <button @click="onSubmit" class="fc-btn fc-btn_primary">安全登录</button>
            </div>
        </div>
    </div>
</template>

<script>
    import api from '../config/api.js';
    import common from '../lib/common.js';
    import {Loading} from 'element-ui';

    export default {
        data: function () {
            return {
                openid: '',
                mobile: '',
                code: '',
                username: '',
                password: '',
            }
        },
        methods: {
            isBind: function () {
                let self = this;
                let url = api.get('bind.isbind');
                let params = {
                    openid: self.openid,
                };

                $.ajax({
                    url: url,
                    data: params,
                    dataType: 'json',
                }).done(function (response) {
                    if (response.errno === '0') {
                        self.isbind = response.data.isbind;
                        if (self.isbind === '1') {
                            self.$router.replace({name: 'my-info'});
                        }
                    }
                }).fail(function () {
                    self.$message.error('请求失败');
                });
            },
            onSubmit: function () {
                if (this.username.trim() === '') {
                    this.$message.error('请输入账号');
                } else if (this.password.trim() === '') {
                    this.$message.error('请输入密码');
                } else {
                    this.submit();
                }
            },
            submit: function () {
                let self = this;
                let url = api.get('bind.bindpost');

                let loadingInstance = Loading.service({text: '正在登录'});

                $.ajax({
                    url: url,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        openid: this.openid,
                        username: this.username,
                        password: this.password,
                    },
                    async: false
                }).done(function (response) {
                    self.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        loadingInstance.close();
                    });

                    if (response.errno === '0') {
                        localStorage.setItem('_isbind_', '1');

                        self.$message.success({
                            message: '登录成功',
                            duration: 800,
                            onClose: function () {
                                let params = self.$route.params;
                                let refer_name = params.refer_name;
                                let refer_path = params.refer_path;

                                if (refer_name && refer_name.trim() !== '') {
                                    let refer_query = JSON.parse(params.refer_query);
                                    let refer_params = JSON.parse(params.refer_params);

                                    if (!$.isEmptyObject(refer_query)) {
                                        self.$router.replace({path: refer_path, query: refer_query});
                                    } else if (!$.isEmptyObject(refer_params)) {
                                        self.$router.replace({name: refer_name, params: refer_params});
                                    } else {
                                        self.$router.replace({name: refer_name});
                                    }
                                } else {
                                    WeixinJSBridge.call('closeWindow');
                                }
                            }
                        });
                    } else {
                        self.$message.error(response.errmsg);
                    }
                }).fail(function () {
                    self.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        loadingInstance.close();
                    });

                    self.$message.error('请求失败');
                });
            }
        },
        created: function () {
            this.openid = localStorage.getItem('_openid_') || '';
            
            this.isBind();
        },
        mounted: function () {
            document.title = "员工登录";
        }
    }
</script>

<style scoped>
    .login {
        padding: 10px 20px;
        /*background-color: #fff;*/
    }

    .logo-box {
        margin: 50px 0;
    }

    .el-form-item {
        margin-bottom: 10px;
    }
</style>
