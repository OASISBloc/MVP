const jwt = require('jsonwebtoken');
const moment = require('moment');
const apiModel = require('../model/apiModel');
const cryptoUtil = require('./cryptoUtil');

// var SECRET = config.secret;
// var validJwt = require('express-jwt')({secret: SECRET});
let expireTime = 60;

var authTokenUtil = {
    // token 생성
    createAuthToken: function(account, callback) {
        var dt = moment(new Date());
        var tokenVal = dt.format('YYYYMMDDHHmm') + account;
        var loginToken = cryptoUtil.aes256CryptoIv(tokenVal);
        return callback(jwt.sign(
            {
                id: account,
                key: loginToken
            }, 
            config.secret, 
            {
                expiresIn: expireTime + 'm',
                issuer: config.domain,
                subject: 'userInfo'
            })
        );
    },

    // token을 해석해서 유저정보 확인
    isAuthToken: function(req, res, callback) {
        try {
            var headersToken = req.body.accessToken;
            var token = jwt.verify(headersToken, config.secret);
            var account = token.id;
            var loginTokenKey = token.key;
            // 1. DB에 등록된 값과 일치하는지 체크
            apiModel.getUserInfo(account, function(err, result) {
                if (err) {
                    throw err;
                } else {
                    if (result.length > 0 && loginTokenKey) {
                        // 2. 토근생성된 기간이 말료됐는지 체크 2중 체크
                        var loginToken = cryptoUtil.deAes256CryptoIv(loginTokenKey);
                        var yyyy = loginToken.substr(0, 4);
                        var MM = loginToken.substr(4, 2);
                        var DD = loginToken.substr(6, 2);
                        var HH = loginToken.substr(8, 2);
                        var mm = loginToken.substr(10, 2);
                        var loginTime = `${MM}/${DD}/${yyyy} ${HH}:${mm}`;
                        var loginTokenTime = new Date(loginTime);

                        var now = new Date();
                        var gapTime = (now.getTime() - loginTokenTime.getTime()) / 1000 / 60;
                        if (gapTime == undefined || Math.floor(gapTime) > expireTime) {
                            callback(err, false);
                        } else {
                            authTokenUtil.createAuthToken(account, function(refToken) {
                                callback(null, true, account, refToken);
                            });
                        }

                    } else {
                        callback(err, false);
                    }
                }
            });

        } catch (exception) {
            if (exception.name == 'TokenExpiredError') {
                res.json({'result': false, 'loginFlg': true, 'message': 'Your sign in session has expired.\nPlease sign in again.'});
            } else if (exception.name == 'JsonWebTokenError') {
                res.json({'result': false, 'loginFlg': true, 'message': 'Please sign in first.'});
            } else {
                res.json({'result': false, 'message': 'Error occurred.'});
            }
        }
    },

}

module.exports = authTokenUtil;