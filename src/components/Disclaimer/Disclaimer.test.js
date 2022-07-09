import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Disclaimer from ".";

describe("Disclaimer component", () => {
  it("is displayed with correct message", () => {
    const expectedMessage = "TEST_DISCLAIMER";
    render(<Disclaimer message={expectedMessage} />);
    const disclaimerMessageElement = screen.queryByText(expectedMessage);
    expect(disclaimerMessageElement).toBeInTheDocument();
  });
});
