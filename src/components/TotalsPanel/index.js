import React, { useState, useEffect, useContext } from "react";
import { TransactionContext } from "../Context/TransactionContextProvider";
import {
  getFromAddresses,
  getToAddresses,
  getAddressCodes,
  isContractCode,
  toEther,
} from "../../utils/ethereumUtils";
import { BigNumber } from "ethers";
import Totals from "../../global/Totals";

const TotalsPanel = ({ web3State }) => {
  const [transactionState] = useContext(TransactionContext);
  const [displayData, setDisplayData] = useState({
    data: [],
    totalsLoaded: false,
  });

  const styles = {
    border: {
      borderColor: "darkblue",
      border: "double",
      borderWidth: "thick",
    },
  };

  useEffect(() => {
    console.log(
      "TotalsPanel component --- useEffect(transactionState) --- render"
    );
    if (!transactionState.data || transactionState.data.length === 0) {
      console.log(
        "TotalsPanel component --- useEffect(transactionState) --- base case"
      );
      return;
    }

    const totalNumTransactions = transactionState.data.length;
    const totalEthTransferred = getTotalEthTransferred();

    getTotalNumContractAddresses().then((codes) => {
      const contractAddresses = codes.filter(isContractCode);
      const totalNumContractAddresses = contractAddresses.length;
      setDisplayData({
        data: [
          {
            label: Totals.TOTAL_ETH_MOVED.label,
            value: totalEthTransferred,
          },
          {
            label: Totals.TOTAL_NUM_TRANSACTIONS.label,
            value: totalNumTransactions,
          },
          {
            label: Totals.TOTAL_NUM_CONTRACT_ADDRESSES.label,
            value: totalNumContractAddresses,
          },
        ],
        totalsLoaded: true,
      });
    });

    return () => {
      console.log("TotalsPanel --- useEffect(transactionState) --- cleanup");
      setDisplayData({ totalsLoaded: false });
    };
  }, [transactionState]);

  function getTotalEthTransferred() {
    const { data } = transactionState;
    const values = data.map((d) => d.value);
    const totalEthMoved =
      values.length > 0
        ? values.reduce((a, b) => a.add(b))
        : BigNumber.from("0");

    const wei = totalEthMoved.toString();
    const eth = toEther(wei);
    return eth;
  }

  function getTotalNumContractAddresses() {
    const { data } = transactionState;
    const fromAddresses = getFromAddresses(data);
    const toAddresses = getToAddresses(data);
    const addresses = [...fromAddresses, ...toAddresses];

    return getAddressCodes(addresses, web3State);
  }

  return (
    displayData.totalsLoaded && (
      <div style={styles.border}>
        {displayData.data.map((data) => {
          return (
            <p key={data.label}>
              <strong>{data.label}: </strong>
              {data.value}
            </p>
          );
        })}
      </div>
    )
  );
};

export default TotalsPanel;
