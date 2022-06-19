import { ethers } from "ethers";

const getAuthCredentials = () => {
  const { ethereum } = window;
  if (!ethereum) {
    return;
  }
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  return [provider, signer];
};

const walletIsConnected = async () => {
  try {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("make sure you have metamask");
      return false;
    } else {
      console.log("we have the ethereum object: ", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      return accounts[0];
    } else {
      console.log("no authorized account found");
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

const connectWallet = async () => {
  if (!walletIsConnected()) {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("you need metamask");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts[0];
    } catch (error) {
      console.log(error);
    }
  }
};

/**
 *
 * @param {BigNumber} startBlock
 * @param {BigNumber} endBlock
 * loads block data given start and end block numbers
 */
async function loadBlockData(web3, startBlock, endBlock = null) {
  if (!web3) {
    return;
  }
}

/**
 *
 * @param {Array} addresses
 * for each address, check the code to see if its a contract
 * @returns code Promise
 */
async function getAddressCodes(web3, addresses) {
  if (!web3) {
    return;
  }
}

export { getAuthCredentials, connectWallet, loadBlockData, getAddressCodes };
