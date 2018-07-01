<template>
    <div class="info border">
        <div class="">
            <div class="headImg-box border-b">
                <img class="headImg" :src="auditor.headImgUrl"/>
            </div>
            <div class="fc-flex__item pull-5-l info-box">
                <div class="fc-flex pull-5">
                    <div class="fc-flex__item text-left">编&nbsp;&nbsp;&nbsp;&nbsp;号： {{auditor.id}}</div>
                </div>
                <div class="fc-flex pull-5">
                    <div class="fc-flex__item text-left">名&nbsp;&nbsp;&nbsp;&nbsp;称： {{auditor.name}}</div>
                </div>
                <div class="fc-flex pull-5">
                    <div class="fc-flex__item text-left">类&nbsp;&nbsp;&nbsp;&nbsp;型： {{auditor.typeStr}}</div>
                </div>
                <div class="fc-flex pull-5">
                    <div class="fc-flex__item text-left">疾病组： {{auditor.diseasegroup_name}}</div>
                </div>
                <div class="fc-flex pull-5">
                    <div class="fc-flex__item text-left">角&nbsp;&nbsp;&nbsp;&nbsp;色： {{auditor.auditrolesStr}}</div>
                </div>
            </div>
        </div>
        <!--<div class="pull-15-t border-t">-->
            <!--<button class="fc-btn fc-btn_primary" @click="handleUnbind">退出登录</button>-->
        <!--</div>-->
    </div>
</template>

<script>
    import api from '../../config/api.js';
    import common from '../../lib/common.js';
    import {Loading} from 'element-ui';

    export default {
        data: function () {
            return {
                auditor: {
                    id: '',
                    headImgUrl: '',
                    name: '',
                    type: '',
                    typeStr: '',
                    diseasegroup_name: '',
                    auditrolesStr: '',
                    xprovinceid_control: '',
                    cdr_no1: '',
                    cdr_no2: '',
                },
                openid: '',
                isbind: '',
            }
        },
        methods: {
            fetchData: function () {
                let self = this;
                let url = api.get('my.info');
                let params = {
                    openid: self.openid
                };

                common.ajax({
                    url: url,
                    params: params,
                    done: function (data) {
                        self.auditor = data.auditor;
                    },
                    dataFail: function (errmsg) {
                        self.$message.error(errmsg);
                    }
                })
            },
            handleUnbind: function () {
                let self = this;
                this.$confirm('确定要退出登录吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    self.unbindPost();
                }).catch(() => {

                });
            },
            unbindPost: function () {
                let self = this;
                let url = api.get('bind.unbindpost');

                let loadingInstance = Loading.service({text: '正在退出'});

                $.ajax({
                    url: url,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        openid: self.openid
                    },
                    async: false
                }).done(function (response) {
                    self.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        loadingInstance.close();
                    });

                    if (response.errno === '0') {
                        self.$message.success({
                            message: '退出成功',
                            duration: 800,
                            onClose: function () {
                                localStorage.setItem('_isbind_', '0');
                                localStorage.setItem('_openid_', '');
                                WeixinJSBridge.call('closeWindow');
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
            this.fetchData();
        },
        mounted: function () {
            document.title = "员工信息";
        },
    }
</script>

<style scoped>
    .info {
        background-color: #fff;
        padding: 15px;
        margin: 15px;
        border-radius: 8px;
    }

    .headImg-box {
        padding: 25px 0;
        margin-bottom: 20px;
    }

    .headImg {
        width: 130px;
        height: 130px;
        border: 1px solid #ccc;
        border-radius: 65px;
    }

    .info-box {
    }
</style>