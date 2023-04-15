require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = process.env.MNEMONIC_PHRASE;
const infuraKey = process.env.INFURA_API_KEY;

module.exports = {

  networks: {
    // Add mainnet configuration
    mainnet: {
      provider: () => new HDWalletProvider(mnemonic, `https://mainnet.infura.io/v3/${96b1c61fa7564cc9a8786962bf826cd1}`),
      network_id: 1,
      gas: 5500000,
      gasPrice: 22 * 10**9, // 20 gwei in wei
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    // Other network configurations...
  },

  mocha: {
    // timeout: 100000
  },

  compilers: {
    solc: {
      version: "0.8.19",
    }
  },

  // Truffle DB configuration (disabled by default)...
};
