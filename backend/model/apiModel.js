var apiModel = {
    getLoginCheck: function(params, callback) {
        config.connection.getConnection(function(err, connection) {
            var sql = `SELECT count(*) AS cnt
                        FROM wallet_account
                        WHERE account = ?
                            AND password = ?
            `;
            connection.query(sql, [params.account, params.password], callback);
            connection.release();
        })
    },
    getUserInfo: function(param, callback) {
        config.connection.getConnection(function(err, connection) {
            var sql = `SELECT account, email
                        FROM wallet_account
                        WHERE account = ?
            `;
            connection.query(sql, param, callback);
            connection.release();
        })
    }

};

module.exports = apiModel;