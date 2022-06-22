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
      return { connected: Boolean(accounts.length > 0), accounts: accounts };
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
 * @param {Array} addresses
 * for each address, check the code to see if its a contract
 * @returns code Promise
 */
async function getAddressCodes(addresses, web3State) {
  const codePromises = [];
  addresses.forEach((address) => {
    // codePromises.push(web3.eth.getCode(address)); //TODO: convert to ethers
  });

  return Promise.all(codePromises);
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

/**
 *
 * @param {Array} hashes
 * gets transaction promises from tx hashes
 * @returns transaction Promise
 */
function getTransactionsFromBlocks(blocks = [], web3State) {
  const { provider } = web3State;
  if (!provider) {
    console.error("no provider found - check metamask connection.");
    return;
  }
  const hashes = getTxHashesFromBlocks(blocks);
  const promises = [];

  // for each hash, store promise to get the transaction by hash
  hashes.forEach((hash) => {
    promises.push(provider.getTransaction(hash));
  });

  // collectively call all transaction promises
  return Promise.all(promises);
}

export {
  getEthereumProvider,
  getSigner,
  connectWallet,
  getBlocks,
  getAddressCodes,
  walletIsConnected,
  getTransactionsFromBlocks,
};
