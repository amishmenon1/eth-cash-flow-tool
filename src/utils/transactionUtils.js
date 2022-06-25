import { BigNumber } from "ethers";

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

export { groupTransactions };
