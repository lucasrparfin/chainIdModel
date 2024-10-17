const ChainID = require('../models/privacyLedger');

const verifyOwnership = async (req, res, next) => {
  const { chainId } = req.params;
  const userId = req.userId;

  try {

    if(req.role === 'admin') {
      return next();
    }

    const chain = await ChainID.findOne({ where: { chain_id: chainId, userId } });

    if (!chain) {
      return res.status(403).json({ message: "You do not have permission to modify this ChainID." });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Error verifying ownership.", error });
  }
};

module.exports = verifyOwnership;
