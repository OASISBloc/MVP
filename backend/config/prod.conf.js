var mysql = require('mysql');

/**
 * mysql Connection info
 */
var connection = mysql.createPool({
    host    : 'xxx.xxx.xxx.xxx',
    user    : 'id',
    password: 'password',
    port    : 'xxxx',
    database: 'database name',
    multipleStatements: true
});

module.exports = {
    'connection' : connection,
    'domain' : 'localhost:3003',
    'blockchain' : 'blockchain name',
    'protocol' : 'http',
    'host' : 'xxx.xxx.xxx.xxx',
    'port' : xxxx,
    'uploadPort': xxxx,
    'chainId' : 'block chain chainid',
    'keyProvider' : 'private key',
    'aliceKeyProvider' : `alice's private key`,
    'bobKeyProvider' : `bob's private key`,
    'salt': 'sha-256 salt',
    'aes256Alg' : 'aes-256-cbc',
    'aes256Key' : 'aes-256-cbc key',
    'aes256Iv' : 'aes-256-iv key',
    'secret' : 'JWT Token SecretKey',
    'osbTrader' : 'trader',
}