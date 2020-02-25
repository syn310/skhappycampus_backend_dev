const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const controller = require('./applyUserCompanyStatus.controller');
const refreshController = require('../login/login.controller');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/:serialNumber', refreshController.refresh, controller.index);

router.put('/:companyId', refreshController.refresh, controller.update);

module.exports = router;
