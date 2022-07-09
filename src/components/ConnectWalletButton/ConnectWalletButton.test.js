import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { generateTestingUtils } from "eth-testing";
import { mockWeb3State } from "../../test/testWeb3Utils";
import ConnectWalletButton from ".";

describe("ConnectWalletButton component", () => {
  let connectWalletButtonElement;
  const mockCallback = jest.fn();
  const testingUtils = generateTestingUtils({ providerType: "MetaMask" });
  const mockedAccount = "0xf61B443A155b07D2b2cAeA2d99715dC84E839EEf";

  it("is displayed when wallet not connected", () => {
    testingUtils.mockNotConnectedWallet();
    testingUtils.mockRequestAccounts([mockedAccount]);
    const connected = false;
    const mockedWeb3State = mockWeb3State(connected, mockedAccount);
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
    testingUtils.mockConnectedWallet([mockedAccount]);
    const connected = true;
    const mockedWeb3State = mockWeb3State(connected, mockedAccount);
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
