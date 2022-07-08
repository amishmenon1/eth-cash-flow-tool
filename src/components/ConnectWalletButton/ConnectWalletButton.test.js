import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ConnectWalletButton from ".";

let connectWalletButtonElement;

const mockCallback = jest.fn();
const mockWeb3State = (connected) => {
  const mockAccount = connected ? "123456" : null;
  return { connected: connected, account: mockAccount };
};

describe("ConnectWalletButton component", () => {
  it("is displayed when wallet not connected", () => {
    const connected = false;
    const mockedWeb3State = mockWeb3State(connected);
    render(
      <ConnectWalletButton
        web3State={mockedWeb3State}
        onSubmit={mockCallback}
      />
    );
    connectWalletButtonElement = screen.queryByText("Connect Wallet");
    expect(connectWalletButtonElement).toBeInTheDocument();
  });

  it("is not displayed when wallet is connected", () => {
    const connected = true;
    const mockedWeb3State = mockWeb3State(connected);
    render(
      <ConnectWalletButton
        web3State={mockedWeb3State}
        onSubmit={mockCallback}
      />
    );
    connectWalletButtonElement = screen.queryByText("Connect Wallet");
    console.log(connectWalletButtonElement);
    expect(connectWalletButtonElement).not.toBeInTheDocument();
  });
});
