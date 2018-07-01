<template>
    <div class="order">
        <div class="el-tabs el-tabs--top fc-bg_gray">
            <div class="el-tabs__header is-top">
                <div class="el-tabs__nav-wrap is-top">
                    <div class="el-tabs__nav-scroll">
                        <div role="tablist" class="el-tabs__nav">
                            <div class="el-tabs__active-bar is-top"></div>
                            <div id="tab-first"
                                 class="el-tabs__item is-top"
                                 :class="{'is-active': filter_form.type == 'first'}"
                                 @click="handleNavClick('first')">首单
                            </div>
                            <div id="tab-rebuy"
                                 class="el-tabs__item is-top"
                                 :class="{'is-active': filter_form.type == 'rebuy'}"
                                 @click="handleNavClick('rebuy')">复购
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div style="padding-top: 64px;">
            <el-form :inline="true" :model="filter_form" class="filter-form">
                <el-form-item label="医生">
                    <el-select v-model="filter_form.doctorid" placeholder="请选择" class="filter-item"
                               @change="handleDoctorChange">
                        <el-option
                                v-for="doctor in doctors"
                                :key="doctor.id"
                                :label="doctor.name"
                                :value="doctor.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="年份">
                    <el-select v-model="filter_form.year" placeholder="请选择" class="filter-item"
                               @change="handleYearChange">
                        <el-option
                                v-for="item in years"
                                :key="item.key"
                                :label="item.value"
                                :value="item.key"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="月份">
                    <el-select v-model="filter_form.month" placeholder="请选择" class="filter-item"
                               @change="handleMonthChange">
                        <el-option
                                v-for="item in months"
                                :key="item.key"
                                :label="item.value"
                                :value="item.key"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="日期">
                    <el-select v-model="filter_form.day" placeholder="请选择" class="filter-item"
                               @change="handleDayChange">
                        <el-option
                                v-for="item in days"
                                :key="item.key"
                                :label="item.value"
                                :value="item.key"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="来源">
                    <el-select v-model="filter_form.is_lead_by_auditor" placeholder="请选择" class="filter-item"
                               @change="handleLeadByAuditorChange">
                        <el-option
                                v-for="(value, index) in lead_by_auditor"
                                :key="index"
                                :label="value"
                                :value="index"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="占位" style="visibility:hidden;">
                    <el-select v-model="filter_form.is_lead_by_auditor" placeholder="请选择" class="filter-item">
                    </el-select>
                </el-form-item>
                <el-form-item label="占位" style="visibility:hidden;">
                    <el-select v-model="filter_form.is_lead_by_auditor" placeholder="请选择" class="filter-item">
                    </el-select>
                </el-form-item>
                <el-form-item label="占位" style="visibility:hidden;">
                    <el-select v-model="filter_form.is_lead_by_auditor" placeholder="请选择" class="filter-item">
                    </el-select>
                </el-form-item>
            </el-form>

            <el-table
                    :data="rows"
                    border
                    stripe
                    style="width: 100%"
                    empty-text="暂无数据"
                    :default-sort="{prop: 'cnt', order: 'descending'}"
            >
                <el-table-column
                        type="index"
                        label="序号"
                        width="50"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="orderid"
                        label="订单ID"
                        width="95"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="patient_name"
                        label="患者姓名"
                        align="center"
                        width="80px">
                </el-table-column>
                <el-table-column
                        prop="hospital_name"
                        label="医院"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="doctor_name"
                        label="医生"
                        width="80px"
                        align="center">
                </el-table-column>
                <el-table-column
                        label="商品详情"
                        width="120px"
                        align="center">
                    <template slot-scope="scope">
                        <div class="shopproduct-box">
                            <p class="shopproduct-item" v-for="shoporderitem in scope.row.shoporderitems">{{shoporderitem.title}} ×
                                {{shoporderitem.cnt}}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="time_pay"
                        label="时间"
                        width="95px"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="item_sum_price"
                        label="订单金额（不包含邮费）"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="is_lead_by_auditor"
                        label="来源"
                        width="50px"
                        align="center">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import api from '../../../config/api.js';
    import common from '../../../lib/common.js';

    export default {
        data: function () {
            return {
                doctors: [
                    {id: "0", name: "全部", hospital_name: ""}
                ],
                years: [],
                months: [],
                days: [],
                lead_by_auditor: {
                    "0": "全部",
                    "1": "市场",
                    "2": "运营",
                },
                filter_form: {
                    type: "first",
                    doctorid: "0",
                    year: "0",
                    month: "0",
                    day: "0",
                    is_lead_by_auditor: "0"
                },
                rows: [],
            }
        },
        methods: {
            fetchData: function () {
                let self = this;
                let url = api.get('rpt_market.cancerorder');
                let params = JSON.parse(JSON.stringify(this.filter_form));

                let is_lead_by_auditor = params['is_lead_by_auditor'];
                params['is_lead_by_auditor'] = parseInt(is_lead_by_auditor) - 1;

                common.ajax({
                    url: url,
                    params: params,
                    done: function (data, response) {
                        // 将接口返回的cnt进行parseInt，不然无法排序
                        self.rows = data.rows;
                    },
                    dataFail: function (errmsg) {
                        self.$message.error(errmsg);
                    },
                })
            },
            fetchDoctors: function () {
                let self = this;
                let openid = localStorage.getItem('_openid_');
                let url = api.get('doctor.listofauditor');
                let params = {
                    openid: openid,
                    hospitalid: self.filter_form.hospitalid
                };

                common.ajax({
                    url: url,
                    params: params,
                    done: function (data) {
                        self.doctors = data.doctors;
                        self.doctors.unshift({id: "0", name: "全部", hospital_name: ""});

                        self.fetchData();
                    }
                })
            },
            handleNavClick: function (selected) {
                this.filter_form.type = selected;

                this.fetchData();

                let bar = $('.el-tabs__active-bar');
                if (selected === 'first') {
                    bar.css('margin-left', '0');
                } else {
                    bar.css('margin-left', '50%');
                }
            },
            handleDoctorChange: function () {
                this.fetchData();
            },
            handleYearChange: function (year) {
                this.setYear(year);
                this.fetchData();
            },
            setYear: function (year) {
                this.filter_form.year = year;

                this.initMonth();
                this.initDay();

                if (year === "0") {
                    this.filter_form.month = "0";
                    this.filter_form.day = "0";
                }
            },
            handleMonthChange: function (month) {
                this.setMonth(month);

                this.fetchData();
            },
            setMonth: function (month) {
                this.filter_form.month = month;

                this.initDay();

                if (month === "0") {
                    this.filter_form.day = "0";
                }
            },
            handleDayChange: function (day) {
                this.setDay(day);

                this.fetchData();
            },
            setDay: function (day) {
                this.filter_form.day = day;
            },
            handleLeadByAuditorChange: function () {
                this.fetchData();
            },
            initYear: function () {
                let date = new Date(),
                    min_year = 2017,
                    max_year = date.getFullYear();

                this.years = [{
                    "key": "0",
                    "value": "全部"
                }];
                for (let year = min_year; year <= max_year; year++) {
                    this.years.push({
                        'key': year,
                        'value': year + "年"
                    });
                }
            },
            initMonth: function () {
                this.months = [{
                    "key": "0",
                    "value": "全部"
                }];
                if (this.filter_form.year !== "0") {
                    for (let month = 1; month <= 12; month++) {
                        this.months.push({
                            'key': month,
                            'value': month + "月"
                        });
                    }
                }
            },
            initDay: function () {
                this.days = [{
                    "key": "0",
                    "value": "全部"
                }];
                if (this.filter_form.year !== "0" && this.filter_form.month !== "0") {
                    let year = parseInt(this.filter_form.year),
                        month = parseInt(this.filter_form.month),
                        day_cnt = new Date(year, month, 0).getDate();
                    for (let day = 1; day <= day_cnt; day++) {
                        this.days.push({
                            'key': day,
                            'value': day + "号"
                        });
                    }
                }
            },
        },
        created: function () {
            // 默认当天
            let date = new Date();
            this.setYear(date.getFullYear());
            this.setMonth(date.getMonth() + 1);
            this.setDay(date.getDate());

            this.initYear();
            this.initMonth();
            this.initDay();

            this.filter_form.type = this.$route.query.type || 'first';
            this.fetchDoctors();
        },
        mounted: function () {
            document.title = "查询-订单";

            let bar = $('.el-tabs__active-bar');
            if (this.filter_form.type === 'first') {
                bar.css('margin-left', '0');
            } else {
                bar.css('margin-left', '50%');
            }
        }
    }
</script>

<style scoped>
    .order {
        padding: 0;
    }

    .filter-item {
        width: 105px;
    }

    .el-tabs {
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 1000;
    }

    .el-tabs__header {
        margin: 0;
    }

    .el-tabs__nav {
        width: 100%;
    }

    .el-tabs__active-bar {
        width: 50%;
    }

    .el-tabs__item {
        width: 50%;
        height: 50px;
        line-height: 50px;
        padding: 0;
    }

    .shopproduct-box > .shopproduct-item {
        padding: 8px 0;
        border-bottom: 1px dashed #ddd;
    }

    .shopproduct-box > .shopproduct-item:last-of-type {
        margin-bottom: 0;
        border-bottom: 0;
    }

    @media screen and (min-width: 320px) {
        .filter-form {
            height: 189px;
        }
    }

    @media screen and (min-width: 568px) {
        .filter-form {
            height: 126px;
        }
    }

    @media screen and (min-width: 736px) {
        .filter-form {
            height: 63px;
        }
    }

</style>
