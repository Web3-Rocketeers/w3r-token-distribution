const { ethers } = require("ethers");

const ERC20_ABI = [
  // Add your ERC-20 token's ABI here
];

const PRIVATE_KEY = "your_private_key";
const TOKEN_ADDRESS = "your_token_address";
const DISTRIBUTION_LIST = [
  { address: "address_1", amount: "amount_1" },
  { address: "address_2", amount: "amount_2" },
];

async function distributeTokens() {
  try {
    // const provider = new ethers.providers.InfuraProvider("homestead");
    const provider = new ethers.providers.JsonRpcProvider("https://sepolia.rpc.alchemyapi.io/v2/jYnNkhfVjRDvsdKtLZ4NMqwxSkxCfidA");
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, wallet);

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
