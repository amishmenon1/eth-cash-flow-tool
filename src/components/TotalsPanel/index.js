import React, { useState, useEffect, useContext } from "react";
import { TransactionContext } from "../Context/TransactionContextProvider";
import {
  getFromAddresses,
  getToAddresses,
  getAddressCodes,
  isContractCode,
} from "../../utils/ethereumUtils";
import { BigNumber } from "ethers";

//TODO: rename to DisplayPanel
const TotalsPanel = ({ web3State }) => {
  const [transactionState, dispatch] = useContext(TransactionContext);

  const [displayData, setDisplayData] = useState([]);

  useEffect(() => {
    console.log("TotalsPanel useEffect() --- render");
    if (!transactionState.data || transactionState.data.length === 0) {
      console.log(
        "TotalsPanel useEffect() --- base case--- transactionState: ",
        transactionState
      );
      return;
    }

    const totalNumTransactions = transactionState.data.length;
    const totalEthTransferred = getTotalEthTransferred();

    getTotalNumContractAddresses().then((codes) => {
      const contractAddresses = codes.filter(isContractCode);
      const totalNumContractAddresses = contractAddresses.length;
      setDisplayData([
        {
          label: "Total Ether transferred (ETH)",
          value: totalEthTransferred,
        },
        {
          label: "Total # transactions",
          value: totalNumTransactions,
        },
        {
          label: 'Total # contract addresses ("0x")',
          value: totalNumContractAddresses,
        },
      ]);
    });
  }, [transactionState]);

  //TODO: create functions to calculate these fields?
  useEffect(() => {
    console.log(
      "TotalsPanel useEffect render -- transaction state: ",
      transactionState
    );
    console.log("TotalsPanel useEffect render -- web3 state: ", web3State);
  }, []);

  function getTotalEthTransferred() {
    const { data } = transactionState;
    const values = data.map((d) => d.value);
    const totalEthMoved =
      values.length > 0
        ? values.reduce((a, b) => a.add(b))
        : BigNumber.from("0");

    return totalEthMoved.toNumber();
  }

  function getTotalNumContractAddresses() {
    const { data } = transactionState;
    const fromAddresses = getFromAddresses(data);
    const toAddresses = getToAddresses(data);
    const addresses = [...fromAddresses, ...toAddresses];

    return getAddressCodes(addresses, web3State);
  }

  return (
    <div>
      {displayData.map((data) => {
        return (
          <p key={data.label}>
            <strong>{data.label}: </strong>
            {data.value}
          </p>
        );
      })}
    </div>
  );
};

export default TotalsPanel;
