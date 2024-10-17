const express = require('express');
const router = express.Router();
const chainIDController = require('../controllers/chainIDController');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');
const verifyOwnership = require('../middlewares/verifyOwnership');

router.get('/validate-chainid/:chainId', verifyToken, chainIDController.validateChainID);

router.post('/register-chainid', verifyToken, chainIDController.registerChainID);

router.get('/all-chainids', [verifyToken, verifyAdmin], chainIDController.getAllChainIDs);

router.get('/my-chainids', verifyToken, chainIDController.getUserChainIDs);

router.put('/update-chainid/:chainId', [verifyToken, verifyOwnership], chainIDController.updateChainID);

router.delete('/delete-chainid/:chainId', [verifyToken, verifyOwnership], chainIDController.deleteChainID);

module.exports = router;
