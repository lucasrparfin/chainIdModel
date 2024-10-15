const express = require('express');
const router = express.Router();
const chainIDController = require('../controllers/chainIDController');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.get('/validate-chainid/:chainId', verifyToken, chainIDController.validateChainID);

router.post('/register-chainid', verifyToken, chainIDController.registerChainID);

router.get('/all-chainids', [verifyToken, verifyAdmin], chainIDController.getAllChainIDs);

router.delete('/delete-chainid/:chainId', [verifyToken, verifyAdmin], chainIDController.deleteChainID);

module.exports = router;
