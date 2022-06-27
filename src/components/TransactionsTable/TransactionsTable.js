import React, { useState, useEffect, useContext } from "react";
import { Button } from "react-bootstrap";
import { TransactionContext } from "../Context/TransactionContextProvider";
import { TableFilterComponent, TableDisplay } from "./";
import {
  getBlocks,
  getTransactionsFromBlocks,
} from "../../utils/ethereumUtils";
import { groupTransactions } from "../../utils/transactionUtils";
import Status from "../../global/Status";
import TableFilter from "../../global/TableFilter";
import TableHeaders from "../../global/TableHeaders";

const { SENDER, RECIPIENT } = TableFilter;
const { SENDER_HEADERS, RECIPIENT_HEADERS } = TableHeaders;

function TableIfExists(transactionState, tableState) {
  const loader = (
    <Button variant="link" id="loader" className="text-center">
      Loading...
    </Button>
  );
  const tableStyle = { maxHeight: "400px", overflowY: "scroll" };
  switch (transactionState.status) {
    case Status.IDLE:
      return <div>*** Submit a block range ***</div>;
    case Status.PENDING:
      return loader;
    case Status.REJECTED:
      throw new Error("Something went wrong. Please check connection.");
    case Status.RESOLVED:
      const { data, headers } = tableState;
      const noRecordsFound = transactionState.data.length === 0;
      const recordsNotRenderedYet =
        transactionState.data.length > 0 && data.length === 0;
      let display;
      if (noRecordsFound) {
        display = <div>No Records Found.</div>;
      } else if (recordsNotRenderedYet) {
        display = loader;
      } else {
        display = (
          <div style={tableStyle}>
            <TableDisplay headers={headers} data={data} />
          </div>
        );
      }
      return display;
    case Status.FILTERED: {
      return (
        <div style={tableStyle}>
          <TableDisplay headers={headers} data={data} />
        </div>
      );
    }
    default:
      throw new Error("This should be impossible");
  }
}

const TransactionsTable = ({ web3State, blockInputs, endStatusCallback }) => {
  console.log("TransactionTable component ---- render");
  const { startBlock, endBlock } = blockInputs;
  const [transactionState, dispatch] = useContext(TransactionContext);
  const [selectedFilter, setSelectedFilter] = useState(SENDER);
  const [tableState, setTableState] = useState({
    data: [],
    headers: SENDER_HEADERS,
  });

  /**
   * Re-load transaction data anytime a new start or end block is submitted
   */
  useEffect(() => {
    console.log(
      "TransactionsTable useEffect(startBlock, endBlock) --- render --- status: ",
      transactionState.status
    );

    if (!startBlock || !selectedFilter) {
      console.log(
        "TransactionsTable useEffect(startBlock, endBlock) -- base case"
      );

      return;
    }
    async function loadTransactionData() {
      dispatch({
        type: Status.PENDING,
      });

      const blocks = await getBlocks(startBlock, endBlock, web3State);
      const transactions = await getTransactionsFromBlocks(blocks, web3State);
      const finalStatus = !transactions ? Status.REJECTED : Status.RESOLVED;

      dispatch({
        data: transactions,
        type: finalStatus,
      });
    }

    loadTransactionData();
    return () => {
      console.log(
        "TransactionsTable --- useEffect(startBlock, endBlock) ---- cleanup"
      );
    };
  }, [startBlock, endBlock]);

  useEffect(() => {
    console.log(
      "TransactionsTable --- useEffect(txData, selectedFilter) --- render"
    );
    if (transactionState.status !== Status.RESOLVED) {
      console.log(
        "TransactionsTable --- useEffect(txData, selectedFilter) -- base case "
      );
      return;
    }

    const groupedTransactions = groupAndFilterTransactions(
      transactionState.data,
      selectedFilter.value
    );
    const headers = getHeaders(selectedFilter.value);
    setTableState({
      data: groupedTransactions,
      headers,
    });
  }, [transactionState.data, selectedFilter]);

  useEffect(() => {
    console.log("TransactionTable useEffect(status) --- render");
    if (transactionState.status === Status.RESOLVED) {
      transactionState.endStatusCallback();
    }
  }, [transactionState.status]);

  function groupAndFilterTransactions(data, selectedFilter) {
    const groupedTransactions = groupTransactions(data, selectedFilter).filter(
      (tx) => !!tx.address
    );
    return groupedTransactions;
  }

  function getHeaders(selectedFilter) {
    return selectedFilter === SENDER.value ? SENDER_HEADERS : RECIPIENT_HEADERS;
  }

  function handleFilterToggle(newFilter) {
    setSelectedFilter(newFilter === SENDER.value ? SENDER : RECIPIENT);
  }

  return (
    <>
      {transactionState.status === Status.RESOLVED && (
        <TableFilterComponent toggleCallback={handleFilterToggle} />
      )}
      {TableIfExists(transactionState, tableState)}
    </>
  );
};

export default TransactionsTable;
