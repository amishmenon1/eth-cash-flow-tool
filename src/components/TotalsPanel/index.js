import React, { useEffect, useContext } from "react";
import { TransactionContext } from "../Context/TransactionContextProvider";

//TODO: rename to DisplayPanel
const TotalsPanel = ({ web3State }) => {
  const [transactionState, dispatch] = useContext(TransactionContext);
  const displayData = [
    {
      label: "Total Ether transferred (ETH)",
      value: 0,
    },
    {
      label: "Total # transactions",
      value: 0,
    },
    {
      label: 'Total # contract addresses ("0x")',
      value: 0,
    },
  ];

  function calculateTotalEthTransferred() {}

  function calculateTotalNumTransactions() {}

  function calculateTotalNumContractAddresses() {}

  //TODO: create functions to calculate these fields?
  useEffect(() => {
    console.log("transaction state: ", transactionState);
    console.log("web3 state: ", web3State);
  }, []);

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
