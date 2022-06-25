import React, { useState, useEffect, useContext, useRef } from "react";
import { Button } from "react-bootstrap";
import { TransactionContext } from "../Context/TransactionContextProvider";
import { TableFilterComponent, TableDisplay } from "./";
import {
  getBlocks,
  getTransactionsFromBlocks,
} from "../../utils/ethereumUtils";
import { groupTransactions } from "../../utils/transactionUtils";
import Status from "../../enum/Status";
import TableFilter from "../../enum/TableFilter";
import TableHeaders from "../../enum/TableHeaders";

const { SENDER, RECIPIENT } = TableFilter;
const { SENDER_HEADERS, RECIPIENT_HEADERS } = TableHeaders;

function TableIfExists(transactionState, tableState) {
  const loader = (
    <Button variant="link" id="loader" className="text-center">
      Loading...
    </Button>
  );

  switch (transactionState.status) {
    case Status.IDLE:
      console.log("Status ---- idle");
      return <div>*** Submit a block range ***</div>;
    case Status.PENDING:
      console.log("Status ---- pending");
      return loader;
    case Status.REJECTED:
      console.log("Status ---- rejected");
      throw new Error("promise rejected");
    case Status.RESOLVED:
      console.log("Status ---- resolved");
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
          <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
            <TableDisplay headers={headers} data={data} />
          </div>
        );
      }
      return display;
    case Status.FILTERED: {
      console.log("Status ---- filtered");
      return (
        <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
          <TableDisplay headers={headers} data={data} />
        </div>
      );
    }
    default:
      throw new Error("This should be impossible");
  }
}

const TransactionsTable = ({ web3State, blockInputs }) => {
  console.log("TransactionTable ---- render");
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
      "TransactionsTable useEffect(start, end) -- render -- status: ",
      transactionState.status
    );

    if (!startBlock || !selectedFilter) {
      return;
    }
    console.log("TransactionsTable useEffect(start, end) -- after base case");
    async function loadTransactionData() {
      dispatch({
        type: Status.PENDING,
      });

      const blocks = await getBlocks(startBlock, endBlock, web3State);
      const transactions = await getTransactionsFromBlocks(blocks, web3State);
      console.log("transactions loaded: ", Array.from(transactions));

      dispatch({
        data: transactions,
        type: Status.RESOLVED,
      });
    }

    loadTransactionData();
    return () => {
      console.log("TransactionsTable useEffect(start, end) - cleanup");
    };
  }, [startBlock, endBlock]);

  useEffect(() => {
    console.log(
      "TransactionsTable useEffect(txData, selectedFilter) -- render -- current status: ",
      transactionState.status
    );
    if (!selectedFilter || transactionState.status !== Status.RESOLVED) {
      console.log(
        "TransactionsTable useEffect(txData, selectedFilter) -- base case hit, returned nothing. "
      );
      return;
    }
    console.log(
      "TransactionsTable useEffect(txData, selectedFilter) -- after base case: ",
      transactionState.data,
      selectedFilter.value
    );
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
    console.log("TransactionTable useEffect status resolved --- render");
    if (transactionState.status === Status.RESOLVED) {
      console.log("TransactionTable useEffect status resolved --- after check");
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
