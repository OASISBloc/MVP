var express = require('express');
var router = express.Router();
var apiController = require('../controller/apiController');
var path = require('path');
const multer = require('multer');

const upload = multer({
    dest: './uploads',
});

const demoController = require('../controller/demoController');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.renderFile(path.join(__dirname, '../public', 'index.html'));
});

/** 로그인 인증토큰 발행 */
router.post('/api/auth/login', function(req, res) {
    apiController.getAuthLogin(req, res);
});

router.post('/api/auth/certifyAuth', function(req, res) {
    apiController.certifyAuth(req, res);
})

/** 토큰 조회 */
router.post('/api/getCurrencyBalance', function(req, res) {
    apiController.getCurrencyBalance(req, res);
});

// /** 카테고리 조회 */
// router.post('/api/getDataTypeList', function(req, res, next) {
//     apiController.getDataTypeList(req, res);
// });

/** 데이터리스트 조회 */
router.post('/api/getDataList', function(req, res) {
    apiController.getDataList(req, res);
});

/** 거래내역 */
router.post('/api/getActions', function(req, res, next) {
    apiController.getActions(req, res);
});

/** 카테고리 등록 */
router.post('/api/addCategory', function(req, res) {
    apiController.addCategory(req, res);
});

/** 카테고리(만) 조회 */
router.post('/api/getDataTypes', function(req, res) {
    apiController.getDataTypes(req, res);
});

/** 카테고리에 해당하는 데이터 필드 조회 */
router.post('/api/getFieldsOfDataType', function(req, res) {
    apiController.getFieldsOfDataType(req, res);
});

/** 카테고리에 해당하는 데이터 등록 */
router.post('/api/addData', upload.single('file'), function(req, res) {
    apiController.addData(req, res);
});

/** 카테고리에 해당하는 데이터 조회 */
router.post('/api/getCateDataList', function(req, res) {
    apiController.getCateDataList(req, res);
});

/** 데이터 구매 */
router.post('/api/purchase', function(req, res) {
    apiController.purchase(req, res);
});

/** 구매 내역 조회 */
router.post('/api/getTradedDataList', function(req, res) {
    apiController.getTradedDataList(req, res);
});

/** 데이터 등록 내역 조회 */
router.post('/api/getUploadedDataList', function(req, res) {
    apiController.getUploadedDataList(req, res);
});

/** 업로드 데이터 삭제 */
router.post('/api/uploadDataRemove', function(req, res) {
    apiController.uploadDataRemove(req, res);
});


////////////////////////////////////////////////////////////
///////////////////// MVP2 /////////////////////////////////
////////////////////////////////////////////////////////////
router.get('/demo', function(req, res) {
    res.render('./demo');
});

router.post('/demo/addFoodData', function(req, res) {
    demoController.addFoodData(req, res);
});

router.post('/demo/buyFoodData', function(req, res) {
    demoController.buyFoodData(req, res);
});

router.post('/demo/buyFoodDataHistory', function(req, res) {
    demoController.buyFoodDataHistory(req, res);
});


module.exports = router;
