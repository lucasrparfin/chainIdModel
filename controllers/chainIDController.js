const ChainID = require('../models/chainID');
const User = require('../models/user');
const { generateAllPermutations, getRegisteredChainIds, filterValidPermutations } = require('../utils/chainIdUtils');

exports.validateChainID = async (req, res) => {
  const { chainId } = req.params;

  if (!chainId || isNaN(chainId)) {
    return res.status(400).json({ message: 'A valid integer ChainID is required.' });
  }

  try {
    const chain = await ChainID.findOne({ where: { chain_id: chainId } });

    if (chain) {

      const allPermutations = generateAllPermutations(chainId);

      const registeredIds = await getRegisteredChainIds(allPermutations);

      const suggestions = filterValidPermutations(allPermutations, registeredIds, chainId);

      if (suggestions.length === 0) {
        return res.status(409).json({
          valid: false, 
          message: 'The ChainID already exists, and no valid suggestions are available.',
          suggestions: []
        });
      }

      return res.status(409).json({
        valid: false, 
        message: 'The ChainID already exists in the Rayls network. If you wish, I can use one from below', 
        suggestions: suggestions.slice(0, 3)
      });
    } else {
      return res.status(200).json({ valid: true, message: 'ChainID is available for use.' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error validating ChainID.', error });
  }
};

exports.registerChainID = async (req, res) => {
  const { chainId } = req.body;
  const userId = req.userId;

  if (!chainId || isNaN(Number(chainId))) {
    return res.status(400).json({ message: 'A valid integer ChainID is required.' });
  }

  try {
    const chain = await ChainID.findOne({ where: { chain_id: Number(chainId) } });

    if (chain) {

      const allPermutations = generateAllPermutations(chainId);

      const registeredIds = await getRegisteredChainIds(allPermutations);

      const suggestions = filterValidPermutations(allPermutations, registeredIds, chainId);

      if (suggestions.length === 0) {
        return res.status(409).json({
          valid: false, 
          message: 'The ChainID already exists, and no valid suggestions are available.',
          suggestions: []
        });
      }

      return res.status(409).json({
        valid: false,
        message: 'The ChainID already exists in the Rayls network. If you wish, I can use one from below',
        suggestions: suggestions.slice(0, 3)
      });
    }

    const newChainId = await ChainID.create({ chain_id: Number(chainId), userId });
    return res.status(201).json({ message: `ChainID ${newChainId.chain_id} registered successfully.`, newChainId });
  } catch (error) {
    return res.status(500).json({ message: 'Error registering ChainID.', error });
  }
};

exports.getAllChainIDs = async (req, res) => {
  try {
    const chainIds = await ChainID.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username'],
      }]
    });
    return res.status(200).json(chainIds);
  } catch (error) {
    console.error("Error fetching ChainIDs:", error);
    return res.status(500).json({ message: 'Error fetching ChainIDs.', error });
  }
};

exports.deleteChainID = async (req, res) => {
  const { chainId } = req.params;

  if (!chainId || isNaN(Number(chainId))) {
    return res.status(400).json({ message: 'A valid integer ChainID is required.' });
  }

  try {
    const deleted = await ChainID.destroy({ where: { chain_id: Number(chainId) } });

    if (deleted) {
      return res.status(200).json({ message: `ChainID ${chainId} deleted successfully.` });
    } else {
      return res.status(404).json({ message: 'ChainID not found.' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting ChainID.', error });
  }
};
