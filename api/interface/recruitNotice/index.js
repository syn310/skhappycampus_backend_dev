const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const controller = require('./recruitNotice.controller');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', controller.index);

router.get('/:serialNumber', controller.show);

// router.delete('/:serialNumber', controller.destroy);

// router.post('/', controller.create);

// router.put('/:serialNumber', controller.update);

module.exports = router;
