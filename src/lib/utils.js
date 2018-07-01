export default {
    'getNowDate': function (formatstring = 'YYYY-MM-DD') {
        Date.prototype.Format = function (fmt) {
            let o = {
                "M+": this.getMonth() + 1,
                "D+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                "S": this.getMilliseconds()
            };
            if (/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (let k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        };
        let date = new Date();
        date = date.Format(formatstring);
        return date;
    },
    'formatDate': function (date, formatstring = 'YYYY-MM-DD') {
        Date.prototype.Format = function (fmt) {
            let o = {
                "M+": this.getMonth() + 1,
                "D+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                "S": this.getMilliseconds()
            };
            if (/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (let k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        };
        date = date.Format(formatstring);
        return date;
    },
    'getDayOffsetDate': function (offsetValue) {
        let date = new Date();
        let day = date.getDate();
    },
    'getMonthOffsetDate': function () {

    },
    'isLeapYear': function (year) {
        // let value = Number(year);
        // if (value ) {}
    },
    contentHandle: function (content) {
        if (typeof content !== 'undefined' && content != null) {
            return content.replace(/\n/g, '<br/>');
        }
    },
    isArray: function (v) {
        return toString.apply(v) === '[object Array]'
    },
    isObject: function (v) {
        return toString.apply(v) === '[object Object]'
    },
    contains: function (arr, obj) {
        let i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    }
}
