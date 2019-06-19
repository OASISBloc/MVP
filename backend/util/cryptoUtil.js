var crypto = require('crypto')

// var key = new Buffer(config.aes256Key, 'hex');
// var iv = new Buffer(config.aes256Iv, 'hex');

var cryptoUtil = {
	// sha256
	sha256Crypto: function(cryptoVal) {
		return crypto.createHash('SHA256').update(cryptoVal + config.salt).digest('base64');
	},
	// aes-256-cbc iv
	aes256CryptoIv: function(cryptoVal) {
		var key = new Buffer(config.aes256Key, 'hex');
		var iv = new Buffer(config.aes256Iv, 'hex');
		var cipheriv = crypto.createCipheriv(config.aes256Alg, key, iv);
		var returnVal = cipheriv.update(cryptoVal, 'utf8', 'hex');
		returnVal += cipheriv.final('hex');
		return returnVal;
	},
	// de aes-256-cbc iv
	deAes256CryptoIv: function(deCryptoVal) {
		if (!deCryptoVal) return '';
		var key = new Buffer(config.aes256Key, 'hex');
		var iv = new Buffer(config.aes256Iv, 'hex');
		var deCipheriv = crypto.createDecipheriv(config.aes256Alg, key, iv);
		var returnVal = deCipheriv.update(deCryptoVal, 'hex', 'utf8');
		returnVal += deCipheriv.final('utf8');
		return returnVal;
	},
}

module.exports = cryptoUtil;