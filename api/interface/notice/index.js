const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const controller = require('./notice.controller');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//공지사항 리스트 조회
router.get('/', controller.index);

//공지사항 상세조회
router.get('/:noticeSeq', controller.show);

module.exports = router;
