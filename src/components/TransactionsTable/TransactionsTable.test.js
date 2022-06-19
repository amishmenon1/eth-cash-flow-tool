import React from "react";
import ReactDOM from "react-dom";
import TransactionsTable from ".";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<TransactionsTable />, div);
  ReactDOM.unmountComponentAtNode(div);
});
