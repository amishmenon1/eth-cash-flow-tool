import React, { useEffect, useContext } from "react";
import Table from "react-bootstrap/Table";
import "./TransactionsTable.css";
import { TransactionContext } from "../Context/TransactionContextProvider";
import {
  getBlocks,
  getTxHashesFromBlocks,
  getTransactionsFromBlocks,
} from "../../utils/ethereumUtils";

const tableHeaders = [
  {
    key: "h1",
    value: "Header 1",
  },
  {
    key: "h2",
    value: "Header 2",
  },
];

function TableDisplay({ headers, data = [] }) {
  console.log("TableDisplay ---- render");
  const tableContent = () => {
    return data.length === 0 ? (
      <strong>No Records Found.</strong>
    ) : (
      <Table striped bordered condensed="true" hover>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header.key}>{header.value}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={`row-${item.hash}`} className="tableRow results-row">
              <td key={`column-${item.hash}`}>{item.value.toString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };
  return tableContent();
}

const TransactionsTable = ({ web3State, blockInputs }) => {
  console.log("TransactionTable ---- render");
  const { startBlock, endBlock } = blockInputs;
  const [transactionState, dispatch] = useContext(TransactionContext);

  // TODO: on blockinput change, lazy call getTransactionData (useAsync?)

  useEffect(() => {
    if (!startBlock) {
      return;
    }

    async function loadTransactionData() {
      dispatch({
        data: [],
        type: "pending",
      });

      const blocks = await getBlocks(startBlock, endBlock, web3State);
      const hashes = getTxHashesFromBlocks(blocks);
      console.log("hashes: ", hashes);

      const transactions = await getTransactionsFromBlocks(blocks, web3State);
      console.log("transactions: ", Array.from(transactions));
      dispatch({
        data: transactions,
        type: "resolved",
      });
    }

    loadTransactionData();
  }, [startBlock, endBlock]);

  switch (transactionState.status) {
    case "idle": //TODO: status enum
      console.log("TransactionTable ---- idle");
      return <div>Submit a block range</div>; //TODO: styling
    case "pending":
      console.log("TransactionTable ---- pending"); //TODO: styling
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
      debugger;
      return (
        <TableDisplay headers={tableHeaders} data={transactionState.data} />
      );
    default:
      throw new Error("This should be impossible");
  }
};

export default TransactionsTable;
