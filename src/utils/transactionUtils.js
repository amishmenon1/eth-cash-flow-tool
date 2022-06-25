import { BigNumber } from "ethers";

const mapToSenderAddress = (tx) => tx.from;
const mapToSenderTransaction = (t) => {
  return {
    from: t.from,
    value: BigNumber.from(t.value),
  };
};
const mapToRecipientAddress = (tx) => tx.to;
const mapToRecipientTransaction = (t) => {
  return {
    to: t.to,
    value: BigNumber.from(t.value),
  };
};
const isContractCode = (c) => c === "0x";

const getFromAddresses = (txList) => {
  return getMappedAddresses(txList, mapToSenderAddress);
};

const getToAddresses = (txList) => {
  return getMappedAddresses(txList, mapToRecipientAddress);
};

/**
 *
 * @param {Array} txList the list of transactions
 * @param {string} mappedProps the map key
 * @returns mapped list of addresses
 */
const getMappedAddresses = (txList, mapFunction) => {
  let addresses;
  if (txList && txList.constructor === Array) {
    addresses = txList.map(mapFunction).filter((addr) => !!addr);
  } else {
    addresses = [];
  }
  return addresses;
};

/**
 *
 * @param {Array} addresses
 * for each address, check the code to see if its a contract
 * @returns code Promise
 */
const getAddressCodes = async (addresses) => {
  const codePromises = [];
  addresses.forEach((address) => {
    //#TODO: replace with ethers
    // codePromises.push(web3.eth.getCode(address));
  });

  return Promise.all(codePromises);
};

/**
 *
 * @param {Array} txArray list of transactions
 * @param {string} groupByKey the groupBy key
 * @returns a list of transaction totals, grouped by the groupByKey
 */
function groupTransactions(txArray, groupByKey, x) {
  const totals = [];
  txArray.reduce((results, tx) => {
    if (!results[groupByKey]) {
      results[tx[groupByKey]] = {
        value: BigNumber.from("0"),
      };
      // set the correct groupBy key
      results[tx[groupByKey]]["address"] = tx[groupByKey];
      //set a hash to act as a key
      results[tx[groupByKey]]["hash"] = tx["hash"];
      totals.push(results[tx[groupByKey]]);
    }
    results[tx[groupByKey]].value = results[tx[groupByKey]].value.add(tx.value);
    return results;
  }, {});
  return totals;
}

export { groupTransactions, getFromAddresses, getToAddresses, getAddressCodes };
