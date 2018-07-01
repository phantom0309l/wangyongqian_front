<template>
    <div style="margin-top: 100px">
        <img style="width:193px;height:141px" src="../../../static/image/error.png"/>
        <p class="push-10-t fc-text-999"><span>{{errmsg}}</span></p>
    </div>
</template>
<script>
    export default {
        data: function () {
            return {
                errmsg: '页面消失不见了，请联系技术人员。',
            }
        },
        created: function () {
            if (this.$route.redirectedFrom != undefined) {
                this.errmsg = '页面消失不见了，请联系技术人员';
            }
        },
        mounted: function () {

        },
    }
</script>
