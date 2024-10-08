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
          message: 'ChainID already exists, and no valid suggestions are available.',
          suggestions: []
        });
      }

      return res.status(409).json({
        valid: false, 
        message: 'ChainID already exists in the Rayls network. Try the one below', 
        suggestions: [suggestions[0]]
      });
    } else {
      return res.status(200).json({ valid: true, message: 'ChainID is available for use.' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error validating ChainID.', error });
  }
};

// Controlador para registrar ChainID
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
          message: 'ChainID already exists, and no valid suggestions are available.',
          suggestions: []
        });
      }

      return res.status(409).json({
        valid: false,
        message: 'ChainID already exists in the Rayls network. Try the one below',
        suggestions: suggestions.length > 0 ? [suggestions[0]] : []
      });
    }

    const newChainId = await ChainID.create({ chain_id: Number(chainId), userId });
    return res.status(201).json({ message: 'ChainID registered successfully.', newChainId });
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

