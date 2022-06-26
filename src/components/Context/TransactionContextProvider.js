import React, { useReducer } from "react";
import { TransactionsTable } from "../";
import { TotalsPanel } from "../";
import { toast } from "react-toastify";

import Status from "../../global/Status";

export const TransactionContext = React.createContext();

function transactionReducer(state, action) {
  console.log("TxContextProvider --- TxReducer --- render");
  switch (action.type) {
    case Status.IDLE: {
      console.log("TxContextProvider --- TxReducer --- status: idle");
      return {
        status: Status.IDLE,
        data: null,
        error: null,
        endStatusCallback: state.endStatusCallback,
      };
    }
    case Status.PENDING: {
      console.log("TxContextProvider --- TxReducer --- status: pending");
      toast.warn("Loading all data. This could take a few minutes.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
      return {
        status: Status.PENDING,
        data: null,
        error: null,
        endStatusCallback: state.endStatusCallback,
      };
    }
    case Status.RESOLVED: {
      console.log("TxContextProvider --- TxReducer --- status: resolved");
      toast.success("Data successfully loaded.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
      return {
        status: Status.RESOLVED,
        data: action.data,
        error: null,
        endStatusCallback: state.endStatusCallback,
      };
    }
    case Status.REJECTED: {
      console.log(
        "TxContextProvider --- TxReducer --- status: rejected",
        action.error
      );
      toast.error("Failed to fetch: " + action.error, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 10000,
      });
      return {
        status: Status.REJECTED,
        data: null,
        error: action.error,
        endStatusCallback: state.endStatusCallback,
      };
    }
    case Status.FILTERED: {
      return {
        status: Status.FILTERED,
        data: action.data,
        error: null,
        endStatusCallback: state.endStatusCallback,
      };
    }
    default: {
      console.log("TxContextProvider --- TxReducer --- should not occur");
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export function TransactionContextProvider({
  web3State,
  blockInputs,
  endStatusCallback,
}) {
  const [transactionState, dispatch] = useReducer(transactionReducer, {
    data: [],
    status: Status.IDLE,
    endStatusCallback: endStatusCallback,
  });

  return (
    <TransactionContext.Provider value={[transactionState, dispatch]}>
      <TotalsPanel web3State={web3State} />
      <TransactionsTable
        web3State={web3State}
        blockInputs={blockInputs}
        endStatusCallback={endStatusCallback}
      />
    </TransactionContext.Provider>
  );
}
