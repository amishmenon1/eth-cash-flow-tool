import React from "react";
import ReactDOM from "react-dom";
import BlockInput from "./";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<BlockInput />, div);
  ReactDOM.unmountComponentAtNode(div);
});
