var data = {};
export default {
    'set': function (key, value) {
        data[key] = value;
    },
    'get': function (key) {
        return data[key];
    }
}