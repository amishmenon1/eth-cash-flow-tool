import React, { useReducer } from "react";
import { TransactionsTable } from "../";
import { TotalsPanel } from "../";

function loadingStatusReducer(state, action) {
  console.log("loadingStatusReducer---");
  switch (action.type) {
    case "pending": {
      console.log("status: pending");
      return { status: "pending", data: null, error: null };
    }
    case "resolved": {
      console.log("status: resolved");
      return { status: "resolved", data: action.data, error: null };
    }
    case "rejected": {
      console.log("status: rejected");
      return { status: "rejected", data: null, error: action.error };
    }
    default: {
      console.log("status: default/shouldnt happen");
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
export const TransactionContext = React.createContext();

export function TransactionContextProvider(props) {
  const [transactionState, dispatch] = useReducer(loadingStatusReducer, {
    transactions: [],
    status: "idle",
  });
  return (
    <TransactionContext.Provider value={[transactionState, dispatch]}>
      <TotalsPanel {...props} />
      <TransactionsTable {...props} />
    </TransactionContext.Provider>
  );
}
