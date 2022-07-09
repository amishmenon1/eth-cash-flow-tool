import { render, screen, fireEvent } from "@testing-library/react";

const getStartBlockElement = () =>
  screen.getByRole("spinbutton", {
    name: "Start Block",
  });
const getEndBlockElement = () =>
  screen.getByRole("spinbutton", {
    name: "End Block",
  });
const getFetchButton = () =>
  screen.getByRole("button", { name: "Fetch Data!" });

const getTableDisplay = () =>
  screen.getByRole("table", { name: "table-display" });

const simulateBlockInput = (element, inputValue) => {
  fireEvent.change(element, { target: { value: inputValue } });
};
export {
  getStartBlockElement,
  getEndBlockElement,
  getFetchButton,
  simulateBlockInput,
};
