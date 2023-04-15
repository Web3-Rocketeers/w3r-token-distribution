require('dotenv').config();
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { abi: ERC20_ABI } = require('@openzeppelin/contracts/build/contracts/IERC20.json');

const mnemonic = process.env.MNEMONIC_PHRASE;
const infuraKey = process.env.INFURA_API_KEY;

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

const providerUrl = `https://mainnet.infura.io/v3/${infuraKey}`;
const provider = new HDWalletProvider({
  mnemonic,
  providerOrUrl: providerUrl
});

const web3 = new Web3(provider);
const tokenContract = new web3.eth.Contract(ERC20_ABI, TOKEN_ADDRESS);

async function distributeTokens() {

  console.log('Mnemonic:', mnemonic);
  console.log('Infura Key:', infuraKey);
  console.log('Starting token distribution...');

  try {
    const [sender] = await web3.eth.getAccounts();

    let totalGas = Web3.utils.toBN(0);
    const gasPrice = Web3.utils.toWei('22', 'gwei');

    for (const recipient of DISTRIBUTION_LIST) {
      const { address, amount } = recipient;
      const value = Web3.utils.toWei(amount, 'ether');
      const estimatedGas = await tokenContract.methods.transfer(address, value).estimateGas({ from: sender });
      totalGas = totalGas.add(Web3.utils.toBN(estimatedGas));
    }

    console.log(`Total estimated gas: ${totalGas.toString()}`);
    const totalCostInWei = Web3.utils.toBN('4286568000000000');
    const totalCostInEther = Web3.utils.fromWei(totalCostInWei, 'ether');
    console.log(`Total estimated cost (in ether): ${totalCostInEther}`);
    

    // Uncomment the following lines if you want to execute the transfers after estimating the gas
    // for (const recipient of DISTRIBUTION_LIST) {
    //   const { address, amount } = recipient;
    //   const value = Web3.utils.toWei(amount, 'ether');
    //   const tx = await tokenContract.methods.transfer(address, value).send({ from: sender });
    //   console.log(`Sent ${amount} tokens to ${address}, tx hash: ${tx.transactionHash}`);
    // }
  } catch (error) {
    console.error("Error distributing tokens:", error);
  }
}

distributeTokens();