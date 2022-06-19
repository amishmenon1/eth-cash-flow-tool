import React, { useState, useReducer, useEffect, useContext } from "react";
import { ethers } from "ethers";
import Table from "react-bootstrap/Table";
import "./TransactionsTable.css";
import { TransactionContext } from "../Context/TransactionContextProvider";

function TableDisplay({ headers, data = [] }) {
  console.log("TableDisplay ---- render");
  const tableContent = () => {
    return data.length === 0 ? (
      <div>No Records Found.</div>
    ) : (
      data.map((items, index) => (
        <tr key={`row-${index}`} className="tableRow results-row">
          {items.map((item, index) => (
            <td key={`column-${index}`}>{item}</td>
          ))}
        </tr>
      ))
    );
  };
  return (
    <Table striped bordered condensed hover>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>{tableContent()}</tbody>
    </Table>
  );
}

const TransactionsTable = ({ web3State, blockInputs }) => {
  console.log("TransactionTable ---- render");
  const headers = ["Header 1", "Header 2"];
  const { ethereum } = web3State;
  const { startBlock, endBlock } = blockInputs;
  const [transactionState, dispatch] = useContext(TransactionContext);

  // TODO: on blockinput change, lazy call getTransactionData (useAsync?)

  useEffect(() => {
    if (!startBlock) {
      return;
    }
    loadTransactionData(startBlock, endBlock);
  }, [startBlock, endBlock]);

  switch (transactionState.status) {
    case "idle":
      console.log("TransactionTable ---- idle");
      return <div>Submit a block range</div>;
    case "pending":
      console.log("TransactionTable ---- pending");
      return (
        <a id="loader" className="text-center">
          Loading...
        </a>
      );
    case "rejected":
      console.log("TransactionTable ---- rejected");
      throw new Error("promise rejected");
    case "resolved":
      console.log("TransactionTable ---- resolved");
      return (
        <TableDisplay headers={headers} data={transactionState.transactions} />
      );
    default:
      throw new Error("This should be impossible");
  }

  // TODO: dispatch status change here
  function loadTransactionData(block1, block2) {
    dispatch({ type: "pending" });
    console.log(
      `cue loading transaction data.....block1=${block1} block2=${block2}`
    );
  }
};

export default TransactionsTable;
