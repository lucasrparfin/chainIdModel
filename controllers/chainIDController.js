const PrivacyLedger = require("../models/privacyLedger");
const User = require("../models/user");
const {
  generateAllPermutations,
  getRegisteredChainIds,
  filterValidPermutations,
} = require("../utils/chainIdUtils");

exports.validateChainID = async (req, res) => {
  const { chainId } = req.params;

  if (!chainId || isNaN(chainId)) {
    return res
      .status(400)
      .json({ message: "A valid integer ChainID is required." });
  }

  try {
    const chain = await PrivacyLedger.findOne({ where: { chain_id: chainId } });

    if (chain) {
      const allPermutations = generateAllPermutations(chainId);
      const registeredIds = await getRegisteredChainIds(allPermutations);
      const suggestions = filterValidPermutations(
        allPermutations,
        registeredIds,
        chainId
      );

      if (suggestions.length === 0) {
        return res.status(409).json({
          valid: false,
          message:
            "The ChainID already exists, and no valid suggestions are available.",
          suggestions: [],
        });
      }

      return res.status(409).json({
        valid: false,
        message:
          "The ChainID already exists in the network. Here are suggestions:",
        suggestions: suggestions.slice(0, 3),
      });
    } else {
      return res
        .status(200)
        .json({ valid: true, message: "ChainID is available for use." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error validating ChainID.", error });
  }
};

exports.registerChainID = async (req, res) => {
  const { chainId, nodeName, rpcUrl, subnetChainId } = req.body;
  const userId = req.userId;

  if (!chainId || isNaN(Number(chainId))) {
    return res
      .status(400)
      .json({ message: "A valid integer ChainID is required." });
  }

  if (subnetChainId === chainId) {
    return res.status(400).json({
      message: "The Subnet ChainID cannot be the same as the ChainID.",
    });
  }

  try {
    const chain = await PrivacyLedger.findOne({
      where: { chain_id: Number(chainId) },
    });

    if (chain) {
      return res.status(409).json({
        valid: false,
        message: "The ChainID already exists. Please use a different one.",
      });
    }

    const newChainId = await PrivacyLedger.create({
      chain_id: Number(chainId),
      userId,
      nodeName,
      rpcUrl,
      subnetChainId: subnetChainId || null,
    });

    return res.status(201).json({
      message: `ChainID ${newChainId.chain_id} registered successfully.`,
      newChainId,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error registering ChainID.", error });
  }
};

exports.getAllChainIDs = async (req, res) => {
  try {
    const chainIds = await PrivacyLedger.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
        {
          model: PrivacyLedger,
          as: "subnet",
          attributes: ["id", "chain_id", "nodeName", "rpcUrl"],
        },
      ],
    });

    return res.status(200).json(chainIds);
  } catch (error) {
    console.error("Error fetching ChainIDs:", error);
    return res.status(500).json({ message: "Error fetching ChainIDs.", error });
  }
};

exports.getUserChainIDs = async (req, res) => {
  const userId = req.userId;

  try {
    const chainIds = await PrivacyLedger.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
        {
          model: PrivacyLedger,
          as: "subnet",
          attributes: ["id", "chain_id", "nodeName", "rpcUrl"],
        },
      ],
    });

    return res.status(200).json(chainIds);
  } catch (error) {
    console.error("Error fetching ChainIDs:", error);
    return res.status(500).json({ message: "Error fetching ChainIDs.", error });
  }
};

exports.updateChainID = async (req, res) => {
  const { chainId } = req.params;
  const { newChainId, nodeName, rpcUrl, subnetChainId } = req.body;

  if (!newChainId || isNaN(Number(newChainId))) {
    return res
      .status(400)
      .json({ message: "A valid integer ChainID is required." });
  }

  if (subnetChainId === newChainId) {
    return res
      .status(400)
      .json({
        message: "The Subnet ChainID cannot be the same as the ChainID.",
      });
  }

  try {
    const updated = await PrivacyLedger.findOne({
      where: { chain_id: Number(chainId) },
    });

    if (!updated) {
      return res.status(404).json({ message: "ChainID not found." });
    }

    const existingChain = await PrivacyLedger.findOne({
      where: { chain_id: Number(newChainId) },
    });

    if (existingChain && existingChain.id !== updated.id) {
      return res.status(409).json({
        valid: false,
        message: "The ChainID already exists and belongs to another node.",
      });
    }

    updated.chain_id = Number(newChainId);
    updated.nodeName = nodeName;
    updated.rpcUrl = rpcUrl;
    updated.subnetChainId = subnetChainId || null;
    await updated.save();

    return res.status(201).json({
      message: `Node updated successfully`,
      updated,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating ChainID.", error });
  }
};

exports.deleteChainID = async (req, res) => {
  const { chainId } = req.params;

  if (!chainId || isNaN(Number(chainId))) {
    return res
      .status(400)
      .json({ message: "A valid integer ChainID is required." });
  }

  try {
    const deleted = await PrivacyLedger.destroy({
      where: { chain_id: Number(chainId) },
    });

    if (deleted) {
      return res
        .status(200)
        .json({ message: `ChainID ${chainId} deleted successfully.` });
    } else {
      return res.status(404).json({ message: "ChainID not found." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error deleting ChainID.", error });
  }
};
