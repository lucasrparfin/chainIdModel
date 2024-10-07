const express = require('express');
const router = express.Router();
const chainIDController = require('../controllers/chainIDController');
const verifyToken = require('../middlewares/verifyToken');

// Rota para validar o ChainID
router.get('/validate-chainid/:chainId', verifyToken, chainIDController.validateChainID);

// Rota para registrar o ChainID
router.post('/register-chainid', verifyToken, chainIDController.registerChainID);

// Rota para obter todos os ChainIDs
router.get('/all-chainids', verifyToken, chainIDController.getAllChainIDs);

module.exports = router;
