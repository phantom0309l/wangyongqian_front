<template>
    <div class="cancerrank">
        <div class="el-tabs el-tabs--top fc-bg_gray">
            <div class="el-tabs__header is-top">
                <div class="el-tabs__nav-wrap is-top">
                    <div class="el-tabs__nav-scroll">
                        <div role="tablist" class="el-tabs__nav">
                            <div class="el-tabs__active-bar is-top"></div>
                            <div id="tab-doctor"
                                 class="el-tabs__item is-top"
                                 :class="{'is-active': filter_form.type === 'doctor'}"
                                 @click="handleNavClick('doctor')">按活跃医生
                            </div>
                            <div id="tab-patient"
                                 class="el-tabs__item is-top"
                                 :class="{'is-active': filter_form.type === 'patient'}"
                                 @click="handleNavClick('patient')">按报到患者
                            </div>
                            <div id="tab-firstorder"
                                 class="el-tabs__item is-top"
                                 :class="{'is-active': filter_form.type === 'firstorder'}"
                                 @click="handleNavClick('firstorder')">按首单量

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div style="padding-top: 64px;">
            <el-form :inline="true" :model="filter_form" class="filter-form">
                <el-form-item label="区域">
                    <el-select v-model="filter_form.auditorgroup_ename" placeholder="请选择" class="filter-item"
                               @change="handleAuditorGroupChange">
                        <el-option
                                v-for="auditorgroup in auditorgroups"
                                :key="auditorgroup.ename"
                                :label="auditorgroup.name"
                                :value="auditorgroup.ename"
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
                    :row-class-name="tableRowClassName"
            >
                <el-table-column
                        label="序号"
                        width="60"
                        align="center">
                    <template slot-scope="scope">
                        {{getIndex(scope)}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="auditor_name"
                        label="姓名"
                        width="75"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="auditorgroup_name"
                        label="区域"
                        width="80"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="province_name"
                        label="城市"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="cnt"
                        :label="getCntLabel"
                        width="80"
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
                auditorgroups: [
                    {id: "0", ename: "", name: "全部"}
                ],
                years: [],
                months: [],
                filter_form: {
                    type: "doctor",
                    auditorgroup_ename: "Cancer_all",
                    year: "0",
                    month: "0",
                },
                rows: [],
            }
        },
        computed: {
            getCntLabel: function () {
                switch (this.filter_form.type) {
                    case 'doctor':
                        return '活跃医生';
                    case 'patient':
                        return '报到患者';
                    case 'firstorder':
                        return '首单数量';
                }
            }
        },
        methods: {
            fetchData: function () {
                let self = this;
                let url = api.get('performance_market.cancerrank');
                let params = JSON.parse(JSON.stringify(this.filter_form));

                let auditorgroup_ename = params['auditorgroup_ename'];
                // 如果是全部的话，就把所有的分组拼接起来
                let auditorgroupid = '';
                if (auditorgroup_ename === "Cancer_all") {
                    let ids = [];
                    this.auditorgroups.forEach(function (auditorgroup) {
                        if (auditorgroup.ename === 'Cancer_all') {
                            return true;
                        }
                        ids.push(auditorgroup.id);
                    });
                    auditorgroupid = ids.join(',');
                } else {
                    this.auditorgroups.forEach(function (auditorgroup) {
                        if (auditorgroup.ename === auditorgroup_ename) {
                            auditorgroupid = auditorgroup.id;
                        }
                    });
                }
                params['auditorgroupid'] = auditorgroupid;

                common.ajax({
                    url: url,
                    params: params,
                    done: function (data, response) {
                        // 将接口返回的cnt进行parseInt，不然无法排序
                        self.rows = data.rows.map(function (row) {
                            row.cnt = parseInt(row.cnt);
                            return row;
                        })
                    },
                    dataFail: function (errmsg) {
                        self.$message.error(errmsg);
                    },
                })
            },
            fetchAuditorGroups: function () {
                let self = this;
                let openid = localStorage.getItem('_openid_');
                let url = api.get('auditorgroup.listoftypeename');
                let params = {
                    openid: openid,
                    type: 'market',
                    ename: 'Cancer'
                };

                common.ajax({
                    url: url,
                    params: params,
                    done: function (data, response) {
                        self.auditorgroups = data.rows;

                        self.fetchData();
                    },
                    dataFail: function (errmsg) {

                    }
                })
            },
            handleNavClick: function (selected) {
                this.filter_form.type = selected;

                this.fetchData();

                let bar = $('.el-tabs__active-bar');

                if (selected === 'doctor') {
                    bar.css('margin-left', '0');
                } else if (selected === 'patient') {
                    bar.css('margin-left', '33.33%');
                } else {
                    bar.css('margin-left', '66.66%');
                }
            },
            handleAuditorGroupChange: function () {
                this.fetchData();
            },
            handleYearChange: function (year) {
                this.setYear(year);

                this.fetchData();
            },
            setYear: function (year) {
                this.filter_form.year = year;

                this.initMonth();

                if (year === "0") {
                    this.filter_form.month = "0";
                }
            },
            handleMonthChange: function (month) {
                this.setMonth(month);

                this.fetchData();
            },
            setMonth: function (month) {
                this.filter_form.month = month;
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
            getIndex: function (scope) {
                return scope.$index < 3 ? 'No.' + (scope.$index + 1) : scope.$index + 1;
            },
            tableRowClassName({row, rowIndex}) {
                if (row.cnt > 0) {
                    if (rowIndex === 0) {
                        return 'no1';
                    } else if (rowIndex === 1) {
                        return 'no2';
                    } else if (rowIndex === 2) {
                        return 'no3';
                    } else {
                        return ''
                    }
                }
            }
        },
        created: function () {
            // 默认当月
            let date = new Date();
            this.setYear(date.getFullYear());
            this.setMonth(date.getMonth() + 1);

            this.initYear();
            this.initMonth();

            this.fetchAuditorGroups();
        },
        mounted: function () {
            document.title = "绩效排名";
        }
    }
</script>

<style scoped>
    .cancerrank {
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
        width: 33.33%;
    }

    .el-tabs__item {
        width: 33.33%;
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
            height: 126px;
        }
    }

    @media screen and (min-width: 568px) {
        .filter-form {
            height: 63px;
        }
    }

</style>

<style>
    .cancerrank .no1 {
        color: #F45B56;
    }

    .cancerrank .no2 {
        color: #FF8603;
    }

    .cancerrank .no3 {
        color: #FFAD08;
    }

</style>
