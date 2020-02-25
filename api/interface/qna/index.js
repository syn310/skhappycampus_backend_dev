const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const controller = require('./qna.controller');
const refreshController = require('../login/login.controller');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//특정 UserId의 문의 내역 리스트 조회
router.get('/', refreshController.refresh, controller.index);

//문의 상세 조회
router.get('/:qnaSeq',refreshController.refresh, controller.show);

// router.get('/checkNewQna', controller.checkNewQna);

// router.put('/qnaAnswer/:qnaSeq', controller.qnaAnswer);
// router.put('/delete/:qnaSeq', controller.delete);

router.post('/', refreshController.refresh, controller.create);

module.exports = router;
