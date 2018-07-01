<template>
    <div id="app">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>

<script>
    export default {
        name: 'app',
        mounted: function () {
            var self = this;
            $(document).ajaxSuccess(function (event, xhr, settings) {
                if (xhr.responseJSON.errno === '1002') {
                    localStorage.setItem('_openid_', '');
                    localStorage.setItem('_isbind_', '');

                    self.$message.error({
                        // message: '授权失效，请重新进入本页面。',
                        message: xhr.responseJSON.errmsg,
                        duration: 2000,
                        onClose: function () {
                            WeixinJSBridge.call('closeWindow');
                        }
                    });
                } else if (xhr.responseJSON.errno === '1001') {
                    localStorage.setItem('_isbind_', '');

                    self.$message.error({
                        message: '未登录，前往员工登录页面。',
                        duration: 2000,
                        onClose: function () {
                            self.$router.replace({
                                name: 'login',
                                params: {
                                    'refer_name': self.$route.name,
                                    'refer_path': self.$route.path,
                                    'refer_query': JSON.stringify(self.$route.query),
                                    'refer_params': JSON.stringify(self.$route.params),
                                }
                            });
                        }
                    });
                }
            })
        },
        created: function () {

        }
    }
</script>
