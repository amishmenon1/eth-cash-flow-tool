import React from "react";
import ReactDOM from "react-dom";
import TotalsPanel from "./";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<TotalsPanel />, div);
  ReactDOM.unmountComponentAtNode(div);
});
