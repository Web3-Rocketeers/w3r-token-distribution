require('dotenv').config();
const { ethers } = require("ethers");
const HDWalletProvider = require("@truffle/hdwallet-provider");

// Load the seed phrase and Infura project ID from the .env file
const mnemonic = process.env.MNEMONIC_PHRASE;
const infuraKey = process.env.INFURA_API_KEY;

const ERC20_ABI = require('./contracts/erc20Abi.json');

const TOKEN_ADDRESS = "0x2FFf2f9ea00D05a494C46787be23748E382f9d61";
const DISTRIBUTION_LIST = [
  { address: "0x66860efF3f937a016D1FBef90B090995aEd74D0b", amount: "5907" },
  { address: "0xB32F6B2b3aF360b0FaeABA860A14EC13e8FD3cd9", amount: "2577" },
  { address: "0xc8d59c0D204aC4DD36503e2085514AbafF51d879", amount: "14697" },
  { address: "0x48594106613c1Bb5E6495326a397c8AA363bbbAd", amount: "1449" },
  { address: "0x6cA675983404596173A20b4085a78081637b98dE", amount: "4143" },
  { address: "0x7017d587b1684470b40a07Db1cE7aEe7a84D0B5e", amount: "8336" },
  { address: "0x519332B6F24782F14b2796b6f7e80166e31BdED5", amount: "3847" },
  { address: "0x4C707a0D72A2866a247ac98D19b4a2fAF177Ae3d", amount: "8872" },
  { address: "0x09433D5bDeFB5F66e7f1A8b11660A79E523Bc8DC", amount: "1794" },
];

async function distributeTokens() {
  try {
    // Create an HDWalletProvider instance using the seed phrase and the mainnet Infura RPC endpoint
    const providerUrl = `https://mainnet.infura.io/v3/${infuraKey}`;
    const walletProvider = new HDWalletProvider(seedPhrase, providerUrl);

    // Create an ethers provider and signer using the HDWalletProvider
    const provider = new ethers.providers.Web3Provider(walletProvider);
    const signer = provider.getSigner();

    // Create the tokenContract instance
    const tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, signer);

    for (const recipient of DISTRIBUTION_LIST) {
      const amount = ethers.utils.parseUnits(recipient.amount, "ether");
      const tx = await tokenContract.transfer(recipient.address, amount);
      console.log(`Sent ${recipient.amount} tokens to ${recipient.address}, tx hash: ${tx.hash}`);
      await tx.wait();
    }
  } catch (error) {
    console.error("Error distributing tokens:", error);
  }
}

distributeTokens();
