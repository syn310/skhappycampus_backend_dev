const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const controller = require('./company.controller');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', controller.index);

router.get('/:companyId', controller.show);

module.exports = router;
