const Eos = require('eosjs');
const utils = require('../util/utils');
const dateFormat = require('dateformat');

var localEosConfig = {
    chainId: 'chainid',
    httpEndpoint: `http://xxx.xxx.xxx.xxx:xxxx`,
    broadcast: true,
    verbose: false,
    sign: true,
    //  expireInSeconds: 60
};

/**
 * chainid
 * httpendpoint
 * provider account
 * provider private key
 * buyer account
 * buyer private key
 * master account?? osb.trader??
 */
const masterAccount = 'osb.trader';
const providerAccount = 'provider';
const providerKey = 'privider key';
const buyerAccount = 'buyer';
const buyerKey = 'buyer key';
const contractName = 'contract name';

var demoController = {
    // addData
    addFoodData: function(req, res) {
        var menuName = req.body.menuName;
        const eos = Eos(localEosConfig);
        try {
            eos.transaction({
                actions: [{
                    account: masterAccount,
                    name: "adddata",
                    authorization: [{
                        actor: providerAccount,
                        permission: 'active'
                    }],
                    data: {
                        provider: providerAccount,
                        datatypename: 'foodname',
                        price: 25,
                        field1: menuName,
                        field2: '',
                        field3: '',
                        field4: '',
                        field5: '',
                        idfshash: ''
                    }
                }]
            }, {
                keyProvider: providerKey
            }).then(result => {
                var resultConsole = result.processed.action_traces[0].console;
                var txid = result.transaction_id;

                resultmsg = resultConsole;
                res.json({result: true, txid: txid, message: resultmsg});

            }).catch(function(error) {
                console.log(error);
                res.json({result: false, message: 'failed add data'});
            });
        } catch (err) {
            console.log("catch err :: ", err);
        }
    },


    // buyData
    buyFoodData: function(req, res) {
        const eos = Eos(localEosConfig);

        try {
            eos.getTableRows({
                code: masterAccount,
                scope: masterAccount,
                table: 'datas',
                json: true,
                limit: 40000
            }).then(datasResult => {
                var dataArr = datasResult.rows[datasResult.rows.length - 1];
                var dataid = dataArr.dataid;
                var randomCnt = utils.randomInt(2, 5);

                for (var i = 0; i < randomCnt; i++) {

                    setTimeout(() => {
                        eos.transaction({
                            actions: [{
                                account: masterAccount,
                                name: "buydata",
                                authorization: [{
                                    actor: buyerAccount,           // 데모용 구매는 모두 bob으로 고정
                                    permission: "active"
                                }],
                                data: {
                                    user: buyerAccount,
                                    dataid: dataid
                                }
                            }]
                        }, {
                            keyProvider: buyerKey
                        }).then(result => {
                            var resultConsole = result.processed.action_traces[0].console;
                        }).catch(function(error) {
                            console.log(error);
                        });
                    }, i * 1000);
                }

                res.json({result: true, randomCnt: randomCnt});

            }).catch(function(err) {
                console.log(err)
            })
        } catch(error) {
            console.log("try ERR", error);
        }
    },


    buyFoodDataHistory: function(req, res) {
        const eos = Eos(localEosConfig);

        (async () => {
            var result = null;
            try {
                var transactions = [];
                var arrTran = [];
                result = await eos.getActions(providerAccount, -1, -4000);
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

                        //토큰정보 get
                        await eos.getCurrencyBalance(contractName, providerAccount).then(result => {
                            var tokenAmt = result[0].replace("FDT", "");
                            res.json({'result': true, 'buyList': arrBuyList, 'rows': transactions, 'tokenAmt': tokenAmt});
                        }).catch(function(error) {
                            res.json({'result': false});
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
        })();
    }
}

module.exports = demoController;