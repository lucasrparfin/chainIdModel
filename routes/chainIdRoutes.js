const express = require('express');
const router = express.Router();
const chainIDController = require('../controllers/chainIDController'); 
const verifyToken = require('../middlewares/verifyToken');

router.get('/validate-chainid/:chainId', verifyToken, chainIDController.validateChainID);

router.post('/register-chainid', verifyToken, chainIDController.registerChainID);

router.get('/all-chainids', verifyToken, chainIDController.getAllChainIDs);

module.exports = router;
