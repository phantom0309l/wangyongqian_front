import config from './config.js'

let urls = {
    'bind': {
        'getopenid': '/bind/getopenid',
        'isbind': '/bind/isbind',
        'bindpost': '/bind/bindpost',
        'unbindpost': '/bind/unbindpost',
    },
    'my': {
        'info': '/my/info'
    },
    'hospital': {
        'listofauditor': '/hospital/listofauditor',
    },
    'doctor': {
        'listofauditor': '/doctor/listofauditor',
    },
    'auditorgroup': {
        'listoftypeename': '/auditorgroup/listoftypeename',
    },
    'rpt_market': {
        'cancernewpatient': '/rpt_market/cancernewpatient',
        'cancerorder': '/rpt_market/cancerorder',
    },
    'performance_market': {
        'cancerrank': '/performance_market/cancerrank',
    }
};

export default {
    'get': function (str) {
        let params = str.split('.');
        let url = '';
        if (params.length === 1) {
            url = urls[params[0] + ''];
        } else if (params.length === 2) {
            url = urls[params[0] + ''][params[1] + ''];
        } else if (params.length === 3) {
            url = urls[params[0] + ''][params[1] + ''][params[2] + ''];
        }

        url = config.host + url + config.dev;
        return url;
    }
}
