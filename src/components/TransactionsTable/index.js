import React, { useState, useEffect, useContext } from "react";
import { Table, Button, ButtonGroup } from "react-bootstrap";
import "./TransactionsTable.css";
import { TransactionContext } from "../Context/TransactionContextProvider";
import {
  getBlocks,
  getTransactionsFromBlocks,
} from "../../utils/ethereumUtils";
import { groupTransactions } from "../../utils/transactionUtils";
import Status from "../../enum/Status";
import TableFilter from "../../enum/TableFilter";
import { senderHeaders, recipientHeaders } from "../../enum/TableHeaders";

const { SENDER, RECIPIENT } = TableFilter;

const TableFilterComponent = ({ toggleCallback }) => {
  const filters = [SENDER, RECIPIENT];

  return (
    <ButtonGroup
      style={{ paddingTop: "10px", paddingBottom: "20px" }}
      justified="true"
      size="lg"
      className="mb-2"
    >
      {filters.map((filter) => (
        <Button
          style={{ height: "35px", fontSize: "inherit" }}
          onClick={(element) => {
            toggleCallback(element.target.value);
          }}
          value={filter.value}
          key={filter.value}
        >
          {filter.text}
        </Button>
      ))}
    </ButtonGroup>
  );
};

function TableDisplay({ headers, data = [] }) {
  console.log("TableDisplay ---- render");
  const tableContent = () => {
    return data.length === 0 ? (
      <strong>No Records Found.</strong>
    ) : (
      <Table striped bordered condensed="true" hover>
        <thead>
          <tr>
            {headers.value.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={`row-${item.hash}`} className="tableRow results-row">
              <td>{item.address}</td>
              <td>{item.value.toString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };
  return tableContent();
}

function TableIfExists(transactionState, tableState) {
  const loader = (
    <Button variant="link" id="loader" className="text-center">
      Loading...
    </Button>
  );
  switch (transactionState.status) {
    case Status.IDLE:
      console.log("Status ---- idle");
      return <div>*** Submit a block range ***</div>; //TODO: styling
    case Status.PENDING:
      console.log("Status ---- pending"); //TODO: styling
      return loader;
    case Status.REJECTED:
      console.log("Status ---- rejected");
      throw new Error("promise rejected");
    case Status.RESOLVED:
      console.log("Status ---- resolved");
      const { data, headers } = tableState;
      const { endStatusCallback } = transactionState;
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
        <>
          <TableDisplay headers={tableState.headers} data={tableState.data} />
        </>
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
    headers: senderHeaders,
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
    return selectedFilter === SENDER.value ? senderHeaders : recipientHeaders;
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
