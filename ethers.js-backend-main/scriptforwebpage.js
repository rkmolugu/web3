const { ethers } = require("ethers");

console.log ( " Hello Web3 ")


// Connect to the Ethereum network (using a public provider like Infura, Alchemy, or Etherscan)
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');

// Optionally, connect to a test network like Rinkeby or a local Ganache instance
// const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545');

// 1. Get the balance of an address
async function getBalance(address) {
    const balance = await provider.getBalance(address);
    console.log(`Balance of ${address}:`, ethers.utils.formatEther(balance), 'ETH');
}

// 2. Send a transaction
async function sendTransaction(privateKey, to, amountInEther) {
    const wallet = new ethers.Wallet(privateKey, provider);
    const tx = {
        to: to,
        value: ethers.utils.parseEther(amountInEther),
        gasLimit: ethers.utils.hexlify(21000), // gas limit for a standard transaction
        gasPrice: ethers.utils.parseUnits('10', 'gwei'), // gas price in gwei
    };

    const transaction = await wallet.sendTransaction(tx);
    console.log('Transaction sent:', transaction.hash);

    // Wait for the transaction to be mined
    const receipt = await transaction.wait();
    console.log('Transaction mined:', receipt.transactionHash);
}

// 3. Interact with a smart contract
async function interactWithContract() {
    // Example: Uniswap V2 router contract on Ethereum mainnet
    const contractAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
    const abi = [
        'function factory() external view returns (address)',
        'function getPair(address tokenA, address tokenB) external view returns (address pair)',
    ];

    const contract = new ethers.Contract(contractAddress, abi, provider);

    // Call a read-only function
    const factoryAddress = await contract.factory();
    console.log('Factory address:', factoryAddress);

    // If you want to interact with the contract (e.g., send a transaction), use a signer
    // const signer = provider.getSigner();
    // const contractWithSigner = contract.connect(signer);
    // await contractWithSigner.someWriteFunction();
}

// 4. Listen for events
async function listenForEvents() {
    // Example: Listen to the transfer event of an ERC-20 token (e.g., DAI)
    const daiContractAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
    const daiAbi = [
        'event Transfer(address indexed from, address indexed to, uint amount)',
    ];

    const daiContract = new ethers.Contract(daiContractAddress, daiAbi, provider);

    // Listen for the Transfer event
    daiContract.on('Transfer', (from, to, amount) => {
        console.log(`Transfer event detected: ${from} -> ${to} for ${ethers.utils.formatUnits(amount, 18)} DAI`);
    });

    console.log('Listening for Transfer events...');
}

// 5. Get the current block number and gas price
async function getBlockchainInfo() {
    const blockNumber = await provider.getBlockNumber();
    console.log('Current block number:', blockNumber);

    const gasPrice = await provider.getGasPrice();
    console.log('Current gas price:', ethers.utils.formatUnits(gasPrice, 'gwei'), 'gwei');
}

// Execute the functions
(async () => {
    const myAddress = '0xYourEthereumAddress';
    const privateKey = '0xYourPrivateKey';
    const recipient = '0xRecipientAddress';

    await getBalance(myAddress);
    await sendTransaction(privateKey, recipient, '0.01');
    await interactWithContract();
    await listenForEvents();
    await getBlockchainInfo();
})();

