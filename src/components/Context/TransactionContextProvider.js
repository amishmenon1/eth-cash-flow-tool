import React, { useReducer } from "react";
import { TransactionsTable } from "../";
import { TotalsPanel } from "../";
import { toast } from "react-toastify";

import Status from "../../enum/Status";

export const TransactionContext = React.createContext();

function transactionReducer(state, action) {
  console.log("loadingStatusReducer---");
  switch (action.type) {
    case Status.IDLE: {
      console.log("loadingStatusReducer---status: idle");

      return { status: Status.IDLE, data: null, error: null };
    }
    case Status.PENDING: {
      console.log("loadingStatusReducer---status: pending");
      toast.warn("Loading all data. This could take a few minutes.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 10000,
      });
      return { status: Status.PENDING, data: null, error: null };
    }
    case Status.RESOLVED: {
      console.log("loadingStatusReducer---status: resolved");
      toast.success("Data successfully loaded.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
      return { status: Status.RESOLVED, data: action.data, error: null };
    }
    case Status.REJECTED: {
      console.log("loadingStatusReducer---status: rejected");
      toast.error("Failed to fetch: " + action.error, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 10000,
      });
      return { status: Status.REJECTED, data: null, error: action.error };
    }
    case Status.FILTERED: {
      return { status: Status.FILTERED, data: action.data, error: null };
    }
    default: {
      console.log("loadingStatusReducer---status: default/shouldnt happen");
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export function TransactionContextProvider(props) {
  const [transactionState, dispatch] = useReducer(transactionReducer, {
    data: [],
    status: Status.IDLE,
  });

  return (
    <TransactionContext.Provider value={[transactionState, dispatch]}>
      <TotalsPanel {...props} />
      <TransactionsTable {...props} />
    </TransactionContext.Provider>
  );
}
