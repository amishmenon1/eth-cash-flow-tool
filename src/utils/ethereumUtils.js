import { ethers } from "ethers";

function getEthereumProvider(ethereum) {
  return new ethers.providers.Web3Provider(ethereum);
}
function getSigner(provider) {
  const signer = provider.getSigner();
  return [provider, signer];
}

async function walletIsConnected() {
  try {
    const { ethereum } = window;
    let connected;
    if (!ethereum) {
      console.warn("make sure you have metamask");
      connected = false;
    } else {
      const accounts = await ethereum.request({ method: "eth_accounts" });
      connected = Boolean(accounts.length > 0);
      return { connected, accounts };
    }
  } catch (error) {
    console.error(error);
  }
}

async function connectWallet() {
  try {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("you need metamask");
      return;
    }
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(ethereum);
    return [ethereum, provider, accounts[0]];
  } catch (error) {
    console.error(error);
  }
}

/**
 *
 * @param {number} start start block number
 * @param {number} end end block number
 * @returns range from start to end values
 */
function createRange(start, end) {
  return Array.from(Array(end - start + 1).keys()).map((x) => x + start);
}

function getBlockRange(start, end) {
  return createRange(parseInt(start), parseInt(end));
}

async function getBlocks(start, end, web3State) {
  const { provider } = web3State;
  if (!end || end === "0") {
    end = await provider.getBlockNumber();
    console.log(`using latest block number: ${end}`);
  }
  const promises = [];
  const blockRange = getBlockRange(start, end);
  blockRange.forEach((blockNum) => {
    promises.push(provider.getBlock(blockNum));
  });
  return Promise.all(promises);
}

function getTxHashesFromBlocks(blocks) {
  let hashes = [];
  blocks.forEach((blockResponse) => {
    if (blockResponse && blockResponse.transactions) {
      hashes = [...hashes, ...blockResponse.transactions];
    }
  });

  return hashes;
}

function getTransactionsFromBlocks(blocks = [], web3State) {
  const { provider } = web3State;
  if (!provider) {
    console.error("no provider found - check metamask connection.");
    return;
  }
  const hashes = getTxHashesFromBlocks(blocks);
  const promises = [];

  hashes.forEach((hash) => {
    promises.push(provider.getTransaction(hash));
  });

  return Promise.all(promises);
}

const mapToSenderAddress = (tx) => tx.from;
const mapToRecipientAddress = (tx) => tx.to;
const isContractCode = (c) => c === "0x";

function getFromAddresses(txList) {
  return getMappedAddresses(txList, mapToSenderAddress);
}

function getToAddresses(txList) {
  return getMappedAddresses(txList, mapToRecipientAddress);
}

/**
 *
 * @param {Array} txList the list of transactions
 * @param {function} mapFunction the map function
 * @returns mapped list of addresses
 */
function getMappedAddresses(txList, mapFunction) {
  let addresses;
  if (txList && txList.constructor === Array) {
    addresses = txList.map(mapFunction).filter((addr) => !!addr);
  } else {
    addresses = [];
  }
  return addresses;
}

/**
 *
 * @param {Array} addresses
 * for each address, check the code to see if its a contract
 * @returns codes
 */
async function getAddressCodes(addresses, web3State) {
  const { provider } = web3State;
  const codePromises = [];
  addresses.forEach((address) => {
    codePromises.push(provider.getCode(address));
  });

  return Promise.all(codePromises);
}

export {
  getEthereumProvider,
  getSigner,
  connectWallet,
  getBlocks,
  walletIsConnected,
  getTransactionsFromBlocks,
  getAddressCodes,
  isContractCode,
  getFromAddresses,
  getToAddresses,
};
