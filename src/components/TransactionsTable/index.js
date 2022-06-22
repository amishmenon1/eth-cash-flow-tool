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
    <ButtonGroup justified="true" size="lg" className="mb-2">
      {filters.map((filter) => (
        <Button
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
  switch (transactionState.status) {
    case Status.IDLE:
      console.log("Status ---- idle");
      return <div>Submit a block range</div>; //TODO: styling
    case Status.PENDING:
      console.log("Status ---- pending"); //TODO: styling
      return (
        <a id="loader" className="text-center">
          Loading...
        </a>
      );
    case Status.REJECTED:
      console.log("Status ---- rejected");
      throw new Error("promise rejected");
    case Status.RESOLVED:
      console.log("Status ---- resolved");
      const { data, headers } = tableState;
      let display;
      if (transactionState.data.length === 0) {
        display = <div>No Records Found.</div>;
      } else if (transactionState.data.length > 0 && data.length === 0) {
        display = (
          <a id="loader" className="text-center">
            Loading...
          </a>
        );
      } else {
        display = (
          <>
            <TableDisplay headers={headers} data={data} />
          </>
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
  useEffect(() => {
    console.log(
      "TransactionsTable useEffect- start, end -- before check -- status: ",
      transactionState.status
    );

    if (!startBlock || !selectedFilter) {
      return;
    }
    console.log("TransactionsTable useEffect- start, end -- after check");
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
      return () => {
        console.log("TransactionsTable useEffect- start, end -- CLEANUP");
      };
    }

    loadTransactionData();
    return () => {
      console.log("txTable useEffect - cleanup");
    };
  }, [startBlock, endBlock]);

  useEffect(() => {
    console.log(
      "TransactionsTable useEffect- txData, selectedFilter -- before check -- status: ",
      transactionState.status
    );
    if (!selectedFilter || transactionState.status !== Status.RESOLVED) {
      console.log(
        "TransactionsTable useEffect- txData, selectedFilter -- break case, return"
      );
      return;
    }
    console.log(
      "TransactionsTable useEffect- txData, selectedFilter -- after check: ",
      transactionState.data,
      selectedFilter.value
    );
    const groupedTransactions = filterTransactions(
      transactionState.data,
      selectedFilter.value
    );
    const headers = getHeaders(selectedFilter.value);
    setTableState({
      data: groupedTransactions,
      headers,
    });
  }, [transactionState.data, selectedFilter]);

  function filterTransactions(data, selectedFilter) {
    const groupedTransactions = groupTransactions(data, selectedFilter);
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
      <TableFilterComponent toggleCallback={handleFilterToggle} />
      {TableIfExists(transactionState, tableState)}
    </>
  );
};

export default TransactionsTable;
