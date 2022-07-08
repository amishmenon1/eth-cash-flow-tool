import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import BlockInput from ".";

let startBlockElement, endBlockElement, fetchButton;

const mockSubmit = jest.fn();

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

const simulateBlockInput = (element, inputValue) => {
  fireEvent.change(element, { target: { value: inputValue } });
};

beforeEach(() => {
  render(<BlockInput onSubmit={mockSubmit} />);
  startBlockElement = getStartBlockElement();
  endBlockElement = getEndBlockElement();
  fetchButton = getFetchButton();
});

describe("BlockInput component", () => {
  it("renders correctly", () => {
    expect(startBlockElement).toBeInTheDocument();
    expect(endBlockElement).toBeInTheDocument();
    expect(fetchButton).toBeInTheDocument();
  });
});

describe("Start Block Input", () => {
  it("should change when value is entered", () => {
    const expectedValue = "123456";
    simulateBlockInput(startBlockElement, expectedValue);
    expect(startBlockElement.value).toBe(expectedValue);
  });
});

describe("End Block Input", () => {
  it("should change when value is entered", () => {
    const expectedValue = "123456";
    simulateBlockInput(endBlockElement, expectedValue);
    expect(endBlockElement.value).toBe(expectedValue);
  });
});

describe("Fetch Data button", () => {
  it("should be disabled by default", () => {
    expect(fetchButton).toBeDisabled();
  });

  // integration tests

  // it("fetch button disabled when not connected", () => {
  //   expect(fetchButton).toBeDisabled();
  // });

  // it("fetch button disabled after clicked", () => {
  //   const [start, end] = ["1", "10"];
  //   simulateBlockInput(startBlockElement, start);
  //   simulateBlockInput(endBlockElement, end);
  //   fireEvent.click(fetchButton);
  //   expect(fetchButton).toBeDisabled();
  // });

  // it("fetch button enabled when connected", () => {
  //   const [start, end] = ["1", "10"];
  //   simulateUserInput(startBlockElement, start);
  //   simulateUserInput(endBlockElement, end);
  //   fireEvent.click(fetchButton);
  //   expect(fetchButton).not.toBeDisabled();
  // });
});
