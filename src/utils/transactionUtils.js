import { BigNumber, ethers } from "ethers";

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

/**
 *
 * @param {Array} txArray list of transactions
 * @param {string} groupByKey the groupBy key
 * @returns a list of transaction totals, grouped by the groupByKey
 */
const groupTransactions = (txArray, groupByKey) => {
  const totals = [];
  txArray.reduce((results, tx) => {
    if (!results[groupByKey]) {
      results[tx[groupByKey]] = {
        value: BigNumber.from("0"),
      };
      // set the correct groupBy key
      results[tx[groupByKey]][groupByKey] = tx[groupByKey];
      //set a hash to act as a key
      results[tx[groupByKey]]["hash"] = tx["hash"];
      totals.push(results[tx[groupByKey]]);
    }
    results[tx[groupByKey]].value = results[tx[groupByKey]].value.add(tx.value);
    return results;
  }, {});
  return totals;
};

export { groupTransactions };
