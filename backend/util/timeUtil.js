var moment = require('moment');

var timeUtil = {
	transferDate: function(block_time, dateformat) {
        // 시간 설정
        var timezonedate = "";
        if (block_time) {
            var nodeDate = new Date(block_time * 1000);
            var time = moment(nodeDate);
            timezonedate = time.format(dateformat);
        } else {
            timezonedate = "-";
        }
        return timezonedate;
	},
}

module.exports = timeUtil;