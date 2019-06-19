const Eos = require('eosjs');
const async = require('async');
const dateFormat = require('dateformat');
const apiModel = require('../model/apiModel');
const cryptoUtil = require('../util/cryptoUtil');
const authTokenUtil = require('../util/authTokenUtil');
const timeUtil = require('../util/timeUtil');

var apiController = {
    /**
     * 로그인인증 토근 발행
     */
    getAuthLogin: function(req, res) {
        var params = req.body;
        params.password = cryptoUtil.sha256Crypto(params.password);

        apiModel.getLoginCheck(params, function(err, result) {
            if (err) {
                res.json({'result': false, 'message': '데이터 조회 중 오류'});
            } else {
                if (result[0].cnt == 1) {
                    // 토큰 생성
                    authTokenUtil.createAuthToken(params.account, function(authResult) {
                        res.json({'result': true, 'accessToken': authResult});
                    });
                } else {
                    res.json({'result': false, 'message': '로그인 정보 오류'});
                }
            }
        });
    },
    /**
     * 로그인 토큰 재인증
     */
    certifyAuth: function(req, res) {
        authTokenUtil.isAuthToken(req, res, function(err, result, account, refToken) {
            if (!err && result) {
                res.json({'result': result, 'account': account, 'accessToken': refToken});
            } else {
                res.json({'result': result, 'message': 'Please sign in again.'});
            }
        })
    },
    /**
     * 사용자 토큰 조회
     * param account
     */
    getCurrencyBalance: function(req, res) {
        var account = req.body.account;
        const eos = Eos(osbConfig);

        //토큰정보 get
        eos.getCurrencyBalance('eosio.token', account).then(result => {
            var tokenAmt = result[0];
            res.json({'result': true, 'tokenAmt': tokenAmt});
        }).catch(function(error) {
            res.json({'result': false});
        });

    },
    /**
     * 데이터리스트 조회
     */
    getDataList: function(req, res) {
        var params = req.body;
        let provider = params.provider ? params.provider : '';
        var priKey = params.priKey ? params.priKey : '';
        var dataType = params.dataType ? params.dataType : '';
        var locConfig = osbConfig;
        locConfig.keyProvider = config.keyProvider;

        const eos = Eos(locConfig);
        eos.transaction({
            actions: [{
                account: config.osbTrader,
                name: "datalist",
                authorization: [{
                    actor: provider,
                    permission: "active"
                }],
                data: {
                    datatypename: dataType,
                    user: provider
                }
            }]
        }, {
            keyProvider: priKey
        }).then(result => {
            var resultConsole = result.processed.action_traces[0].console;
            var resultmsg = resultConsole;
            res.json(resultmsg);
        }).catch(function(error) {
            res.json(result);
        });
    },

    /** 
     * transaction 조회
     * param account
     */
    getActions: function(req, res) {
        var params = req.body;
        let Account = params.account ? params.account : '';
        var locConfig = osbConfig;
        locConfig.keyProvider = config.keyProvider;

        const eos = Eos(locConfig);

        (async () => {
            var result = null;
            if (Account !== '') {
                try {
                    var transactions = [];
                    var arrTran = [];
                    result = await eos.getActions(Account, -1, -2000);
                    if (result) {
                        if (result.actions.length > 0) {
                            var actions = result.actions;
                            actions.forEach(function(el, i) {
                                var action_id = el.account_action_seq;
                                var block_id = el.action_trace.block_num;
                                var trx_id = el.action_trace.trx_id;

                                var block_time = el.action_trace.block_time;
                                var timezoneoffset = (new Date().getTimezoneOffset() / 60) * -1;
                                var nodeDate = new Date(block_time);
                                nodeDate.setHours(nodeDate.getHours() + timezoneoffset);
                                var timezonedate = dateFormat(nodeDate, "mmm-dd-yyyy, hh:MM:ss TT");

                                var name = el.action_trace.act.name;

                                var tran_info = [
                                    action_id,
                                    block_id,
                                    trx_id,
                                    timezonedate,
                                    name,
                                ];

                                if (!arrTran.includes(trx_id)) {
                                    transactions.push(tran_info);
                                    arrTran.push(trx_id);
                                }

                            })
                            transactions.reverse();

                            res.json({
                                'result': 'OK',
                                'rows': transactions
                            });
                        } else {
                            res.json({
                                'result': 'NONE',
                                'message': 'No Transaction Data'
                            });
                        }
                    } else {
                        res.json({
                            'result': 'NONE',
                            'message': 'No Transaction Data'
                        });
                    }
                } catch (err) {
                    res.json({
                        'result': 'ERR',
                        'message': 'Error occurried.'
                    });
                }
            } else {
                res.json({
                'result': 'NONE',
                'message': 'Account is empty.'
                });
            }
        })();
    },
    /**
     * 데이터 카테고리 추가
     * param name, field1~field5
     */
    addCategory: function(req, res) {
        var params = req.body;
        console.log("addCategory params", params);
        var paramLen = Object.keys(params).length - 1;
        console.log(paramLen);

        const eos = Eos(osbConfig);
        eos.transaction({
            actions: [{
                account: "osb.trader",
                name: "adddatatype",
                authorization: [{
                    actor: "osb.trader",
                    permission: "active"
                }],
                data: {
                    user: "osb.trader",
                    datatypename: params.name,
                    fieldnum: paramLen,
                    field1: params.field1,
                    field2: params.field2,
                    field3: params.field3,
                    field4: params.field4,
                    field5: params.field5
                }
              }]
        }
        , {
            keyProvider: config.keyProvider  // params.privateKey
        }).then(result => {
            var resultConsole = result.processed.action_traces[0].console;
            var message = resultConsole;
            result = {
                message: message
            };
            res.json(result);
        }).catch(function(error) {
            console.log("ERROR addCategory :: ", error);
            result = {
                "message": "EOS트랜젝션 실패"
            };
            res.json(result);
        });
    },

    /**
     * 데이터타입들 조회
     */
    getDataTypes: function(req, res) {
        const eos = Eos(osbConfig);
        (async () => {
            eos.getTableRows({
                json: true,
                code: config.osbTrader,
                scope: config.osbTrader,
                table: "datatypes",
                table_key: "" 
            }).then(result => {
                var dataList = [];
                if (!result) {
                    console.log("No Data Types");
                    resultmsg = "";
                } else {
                    for (var i = 0; i < result.rows.length; i++) {
                        if (result.rows[i].datatypename != "") {
                            //console.log("checked type :" + result.rows[i].datatypename);
                            dataList.push(result.rows[i].datatypename);
                        }
                    }
                    //console.log(dataList);
                    res.json({
                        result: true,
                        menuList: dataList
                    });
                }
            }).catch(function(error) {
                console.log(error);
                res.json({
                    result: false,
                    menuList: '데이터 읽기 실패'
                });
            });
        })();
    },

    /**
     * 데이터타입의 데이터 필드 조회
     */
    getFieldsOfDataType: function(req, res) {
        var typeName = req.body.typeName;
        const eos = Eos(osbConfig);
        (async () => {
            eos.getTableRows({
                json: true,
                code: config.osbTrader,
                scope: config.osbTrader,
                table: "datatypes",
                table_key: "" 
            }).then(result => {
                var fieldList = [];
                if (!result) {
                    console.log("No DataType of Fields");
                    resultmsg = "";
                } else {
                    for (var i = 0; i < result.rows.length; i++) {
                        if (result.rows[i].datatypename == typeName) {
                            for (var j = 1; j < result.rows[i].fieldnum + 1; j++) {
                                var getFieldName = `field${j}name`;
                                var fieldVal = result.rows[i][getFieldName]
                                fieldList.push(fieldVal);
                            }
                        }
                    }
                    //console.log(dataList);
                    res.json({
                        result: true,
                        fieldList: fieldList
                    });
                }
            }).catch(function(error) {
                console.log(error);
                res.json({
                    result: false,
                    menuList: '데이터 읽기 실패'
                });
            });
        })();
    },

    /**
     * 데이터타입의 데이터 등록
     */
    addData: function(req, res) {
        var params = req.body;
        var file = req.file;

        const fs = require('fs');
        var path = `./uploads/${file['filename']}`;
        var uploadFile = fs.readFileSync(path);

        var uploadFileBuffer = Buffer.from(uploadFile);

        fs.unlinkSync(path);

        const ipfsClient = require("ipfs-http-client");
        const ipfs = ipfsClient(config.host, config.uploadPort, {
            protocol: config.protocol
        });

        ipfs.add(uploadFileBuffer, function(err, hash) {
            const data = hash[0];
            const ipfsHash = data.hash;

            const eos = Eos(osbConfig);
            eos.transaction({
                actions: [{
                    account: config.osbTrader,
                    name: "adddata",
                    authorization: [{
                        actor: 'alice',         // 데모용 데이터 등록은 모두 alice로
                        permission: 'active'
                    }],
                    data: {
                        provider: 'alice',
                        datatypename: params.typeName,
                        price: params.price,
                        field1: params.field0,
                        field2: params.field1,
                        field3: params.field2,
                        field4: params.field3,
                        field5: params.field4,
                        idfshash: ipfsHash
                    }
                }]
            }, {
                keyProvider: config.aliceKeyProvider
            }).then(result => {
                var resultConsole = result.processed.action_traces[0].console;
                resultmsg = resultConsole;
                res.json({result: true, message: resultmsg});
            }).catch(function(error) {
                console.log(error);
                res.json({result: false, message: 'failed add data'});
            });
        });
    },
    /**
     * 카테고리에 해당하는 데이터 조회
     * param : dataType
     */
    getCateDataList: function(req, res) {
        var param = req.body;

        const eos = Eos(osbConfig);
        if (param) {
            eos.getTableRows({
                code: config.osbTrader,
                scope: config.osbTrader, // account, -- 계정으로는 검색이 되지 않음...
                table: 'datas',
                json: true,
                limit: 4000
            }).then(datasResult => {
                var dataList = datasResult.rows;
                var rtnResultList = [];
                for (var i = 0; i < dataList.length; i++) {
                    if (param.cate == dataList[i].datatypename) {
                        var rtnResult = {};
                        rtnResult.dataid = dataList[i].dataid;
                        rtnResult.type = dataList[i].datatypename;
                        rtnResult.provider = dataList[i].provider;
                        rtnResult.provDatetime = timeUtil.transferDate(dataList[i].datetime, "YYYY-MM-DD hh:mm:ss");
                        rtnResult.price = dataList[i].price;
                        rtnResult.status = dataList[i].status == 0 ? 'on sale' : 'off sale';
                        rtnResult.title = dataList[i].field1value;
                        rtnResult.dataOrigin = dataList[i].field2value;
                        rtnResult.period = dataList[i].field3value;
                        rtnResult.format = dataList[i].field4value;
                        rtnResult.expirydate = dataList[i].field5value;
                        rtnResult.ipfs = dataList[i].idfshash;
        
                        rtnResultList.push(rtnResult);
                    }
                }
    
                if (rtnResultList.length > 0) {
                    res.json({'result': 'OK', rows: rtnResultList});
                } else {
                    res.json({'result': 'NONE'})
                }
            }).catch(function(err) {
                console.log(err)
            })
        } else {
            res.json({'result': 'ERROR'})
        }
    },
    /**
     * 데이터 구매
     * param: account, dataid
     */
    purchase: function(req, res) {
        var params = req.body;

        const eos = Eos(osbConfig);
        eos.transaction({
            actions: [{
                account: config.osbTrader,
                name: "buydata",
                authorization: [{
                    actor: params.account,           // 데모용 구매는 모두 bob으로 고정
                    permission: "active"
                }],
                data: {
                    user: params.account,
                    dataid: params.dataid
                }
            }]
        }, {
            keyProvider: config.bobKeyProvider
        }).then(result => {
            var resultConsole = result.processed.action_traces[0].console;
            res.json({'result': true, 'message': resultConsole});
        }).catch(function(error) {
            console.log(error);
            res.json({'result': false, 'message': error});
        });
    },
    /**
     * 구매 내역 조회
     * param: account
     */
    getTradedDataList: function(req, res) {
        var account = req.body.account;

        const eos = Eos(osbConfig);
        eos.getTableRows({
            code: config.osbTrader,
            scope: config.osbTrader, // account, -- 계정으로는 검색이 되지 않음...
            table: 'buyhistories',
            json: true,
            limit: 4000,
        }).then(buyhistoriesResult => {
            var list = buyhistoriesResult.rows;
            var arrBuyList = [];
      
            for (var i = 0; i < list.length; i++) {
                var rtnBuyer = list[i].buyer;
                if (account == rtnBuyer) {
                    var buyList = {};
                    buyList.dataid = list[i].dataid;
                    buyList.tradedDate = list[i].datetime;
        
                    arrBuyList.push(buyList);
                }
            }
      
            if (arrBuyList.length > 0) {
                eos.getTableRows({
                    code: config.osbTrader,
                    scope: config.osbTrader, // account, -- 계정으로는 검색이 되지 않음...
                    table: 'datas',
                    json: true,
                    limit: 4000,
                }).then(datasResult => {
                    var dataList = datasResult.rows;
                    var rtnResultList = [];
                    for (var i = 0; i < arrBuyList.length; i++) {
                        for (var j = 0; j < dataList.length; j++) {
                            if (arrBuyList[i].dataid == dataList[j].dataid) {
                                var rtnResult = {};
                                rtnResult.dataid = dataList[j].dataid;
                                rtnResult.type = dataList[j].datatypename;
                                rtnResult.provider = dataList[j].provider;
                                rtnResult.provDatetime = timeUtil.transferDate(dataList[j].datetime, "YYYY-MM-DD hh:mm:ss");
                                rtnResult.price = dataList[j].price;
                                rtnResult.purchased = 'TRUE';
                                rtnResult.status = dataList[j].status == 0 ? 'on sale' : 'off sale';
                                rtnResult.traded = 'TRUE';
                                rtnResult.tradDatetime = timeUtil.transferDate(arrBuyList[i].tradedDate, "YYYY-MM-DD hh:mm:ss");
                                rtnResult.title = dataList[j].field1value;
                                rtnResult.dataOrigin = dataList[j].field2value;
                                rtnResult.period = dataList[j].field3value;
                                rtnResult.format = dataList[j].field4value;
                                rtnResult.expirydate = dataList[j].field5value;
                                rtnResult.ipfs = dataList[j].idfshash;
                
                                rtnResultList.push(rtnResult);
                            }
                        }
                    }
        
                    if (rtnResultList.length > 0) {
                        res.json({
                            'result': 'OK',
                            rows: rtnResultList
                        });
                    } else {
                        res.json({
                            'result': 'NONE'
                        });
                    }
                }).catch(function(err) {
                    console.log(err)
                })
            } else {
                res.json({
                    'result': 'NONE'
                });
            }
      
        }).catch(function(err) {
            res.json({
                'result': 'ERR'
            });
        });
    },
    /**
     * 데이터 등록 내역 조회
     * param: account
     */
    getUploadedDataList: function(req, res) {
        var account = req.body.account;

        const eos = Eos(osbConfig);
        eos.getTableRows({
            code: config.osbTrader,
            scope: config.osbTrader, // account, -- 계정으로는 검색이 되지 않음...
            table: 'datas',
            json: true,
            limit: 4000,
        }).then(datasResult => {
            var list = datasResult.rows;
            var arrSaleList = [];
      
            for (var i = 0; i < list.length; i++) {
                var rtnProvider = list[i].provider;
                if (account == rtnProvider) {
                    var saleList = {};
        
                    saleList.dataid = list[i].dataid;
                    saleList.type = list[i].datatypename;
                    saleList.provider = list[i].provider;
                    saleList.provDatetime = timeUtil.transferDate(list[i].datetime, "YYYY-MM-DD hh:mm:ss");
                    saleList.price = list[i].price;
                    //saleList.purchased = 'TRUE';
                    saleList.status = list[i].status == 0 ? 'on sale' : 'off sale';
                    //saleList.traded = 'TRUE';
                    saleList.tradDatetime = timeUtil.transferDate(list[i].tradedDate, "YYYY-MM-DD hh:mm:ss");
                    saleList.title = list[i].field1value;
                    saleList.dataOrigin = list[i].field2value;
                    saleList.period = list[i].field3value;
                    saleList.format = list[i].field4value;
                    saleList.expirydate = list[i].field5value;
                    saleList.ipfs = list[i].idfshash;
        
                    arrSaleList.push(saleList);
                }
            }
      
            if (arrSaleList.length > 0) {
                eos.getTableRows({
                    code: config.osbTrader,
                    scope: config.osbTrader, // account, -- 계정으로는 검색이 되지 않음...
                    table: 'buyhistories',
                    json: true,
                    limit: 4000,
                }).then(datasResult => {
                    var dataList = datasResult.rows;
                    for (var i = 0; i < arrSaleList.length; i++) {
                        arrSaleList[i].traded = 'FALSE';
                        for (var j = 0; j < dataList.length; j++) {
                            if (arrSaleList[i].dataid == dataList[j].dataid) {
                                arrSaleList[i].traded = 'TRUE';
                                arrSaleList[i].tradDatetime = timeUtil.transferDate(dataList[j].datetime, "YYYY-MM-DD hh:mm:ss");
                            }
                        }
                    }
                    res.json({
                        'result': 'OK',
                        rows: arrSaleList
                    });
                }).catch(function(err) {
                    console.log(err)
                })
            } else {
                res.json({
                    'result': 'NONE'
                });
            }
        }).catch(function(err) {
            res.json({
                'result': 'ERR'
            });
        });
    },
    /**
     * 업로드한 데이터 삭제
     * params: dataid, provider, privateKey
     */
    uploadDataRemove: function(req, res) {
        var reqprovider = req.body.provider;
        var reqdataid = req.body.dataid;

        const eos = Eos(osbConfig);
        eos.transaction({
            actions: [{
                account: config.osbTrader,
                name: "removedata",
                authorization: [{
                    actor: reqprovider,
                    permission: "active"
                }],
                data: {
                    user: reqprovider,
                    dataid: reqdataid
                }
            }]
        }, {
            keyProvider: config.aliceKeyProvider
        }).then(result => {
            var resultConsole = result.processed.action_traces[0].console;
            dtResult = {
                "message": resultConsole,
                "result": true
            };
            res.json(dtResult);

        }).catch(function(error) {
            console.log(error);
            result = {
                "message": "EOS트랜젝션 실패",
                "result": false
            };
            res.json(result);
        });
    }
}

module.exports = apiController;