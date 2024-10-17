const ChainID = require('../models/privacyLedger');

// Função para gerar todas as permutações possíveis de um conjunto de números
const generateAllPermutations = (chainId) => {
  const digits = chainId.toString().split('');
  const results = [];

  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      results.push(m.join(''));
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  };

  permute(digits);
  return results;
};

// Função para verificar se um ChainID já existe no banco
const checkIfChainIDExists = async (chainId) => {
  const existingChain = await ChainID.findOne({ where: { chain_id: chainId } });
  return !!existingChain; // Retorna true se existir
};

// Função para encontrar todas as permutações registradas no banco
const getRegisteredChainIds = async (allPermutations) => {
  const registeredChainIds = await ChainID.findAll({
    where: { chain_id: allPermutations }
  });

  return registeredChainIds.map(c => c.chain_id.toString());
};

// Função para filtrar permutações válidas (não registradas)
const filterValidPermutations = (allPermutations, registeredIds, originalChainId) => {
  return allPermutations.filter(p => !registeredIds.includes(p) && p !== originalChainId);
};

module.exports = {
  generateAllPermutations,
  checkIfChainIDExists,
  getRegisteredChainIds,
  filterValidPermutations
};
