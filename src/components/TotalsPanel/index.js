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

  //TODO: create functions to calculate these fields?
  useEffect(() => {
    console.log("transaction state: ", transactionState);
    console.log("web3 state: ", web3State);
  }, []);

  return (
    <div>Totals Placeholder</div>
    // <Panel bsStyle="info" className="centeralign">
    //   <Panel.Heading>
    //     <Panel.Title componentClass="h3">Totals</Panel.Title>
    //   </Panel.Heading>
    //   <Panel.Body>
    //     {displayData.map((data) => {
    //       return (
    //         <p>
    //           <strong>{data.label}: </strong>
    //           {data.value}
    //         </p>
    //       );
    //     })}
    //   </Panel.Body>
    // </Panel>
  );
};

export default TotalsPanel;
