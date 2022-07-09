import React from "react";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import {
  getStartBlockElement,
  getEndBlockElement,
  getFetchButton,
  simulateBlockInput,
} from "../../test/testUtils";
import BlockInput from ".";

let startBlockElement, endBlockElement, fetchButton;
const mockSubmit = jest.fn();

function clearBlockInputs() {
  simulateBlockInput(startBlockElement, "");
  simulateBlockInput(endBlockElement, "");
}

describe("BlockInput component", () => {
  beforeEach(() => {
    render(<BlockInput onSubmit={mockSubmit} />);
    startBlockElement = getStartBlockElement();
    endBlockElement = getEndBlockElement();
    fetchButton = getFetchButton();
  });

  afterEach(() => {
    clearBlockInputs();
  });

  it("renders correctly", () => {
    expect(startBlockElement).toBeInTheDocument();
    expect(endBlockElement).toBeInTheDocument();
    expect(fetchButton).toBeInTheDocument();
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
  });
});
