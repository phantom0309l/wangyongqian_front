<template>
    <div class="newpatient">
        <el-form :inline="true" :model="filter_form" class="filter-form">
            <el-form-item label="医院">
                <el-select v-model="filter_form.hospitalid" placeholder="请选择" class="filter-item"
                           @change="handleHospitalChange">
                    <el-option
                            v-for="hospital in hospitals"
                            :key="hospital.id"
                            :label="hospital.name"
                            :value="hospital.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
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
                    align="center"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="hospital_name"
                    align="center"
                    label="医院">
            </el-table-column>
            <el-table-column
                    prop="doctor_name"
                    align="center"
                    label="医生">
            </el-table-column>
            <el-table-column
                    prop="cnt"
                    label="报到患者"
                    align="center"
                    sortable>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import api from '../../../config/api.js';
    import common from '../../../lib/common.js';

    export default {
        data: function () {
            return {
                hospitals: [
                    {id: "0", name: "全部"}
                ],
                doctors: [
                    {id: "0", name: "全部", hospital_name: ""}
                ],
                years: [],
                months: [],
                filter_form: {
                    hospitalid: "0",
                    doctorid: "0",
                    year: "0",
                    month: "0",
                },
                rows: [],
            }
        },
        methods: {
            fetchData: function () {
                let self = this;
                let url = api.get('rpt_market.cancernewpatient');
                let params = this.filter_form;

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
                    }
                })
            },
            fetchHospitals: function () {
                let self = this;
                let openid = localStorage.getItem('_openid_');
                let url = api.get('hospital.listofauditor');
                let params = {
                    openid: openid,
                };

                common.ajax({
                    url: url,
                    params: params,
                    done: function (data, response) {
                        self.hospitals = data.hospitals;
                        self.hospitals.unshift({id: "0", name: "全部"});

                        self.fetchData();
                    }
                })
            },
            fetchDoctors: function () {
                let self = this;
                let url = api.get('doctor.listofauditor');
                let params = {
                    hospitalid: self.filter_form.hospitalid
                };

                common.ajax({
                    url: url,
                    params: params,
                    done: function (data, response) {
                        self.doctors = data.doctors;
                        self.doctors.unshift({id: "0", name: "全部", hospital_name: ""});
                    }
                })
            },
            handleHospitalChange: function () {
                this.filter_form.doctorid = "0";
                this.doctors = [{id: "0", name: "全部", hospital_name: ""}];
                this.fetchDoctors();
                this.fetchData();
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
        },
        created: function () {
            // 默认当月
            let date = new Date();
            this.setYear(date.getFullYear());
            this.setMonth(date.getMonth() + 1);

            this.initYear();
            this.initMonth();

            this.fetchHospitals();
        },
        mounted: function () {
            document.title = "查询-拓展";
        }
    }
</script>

<style scoped>
    .newpatient {
        padding: 20px 0 0;
    }

    .filter-item {
        width: 105px;
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
