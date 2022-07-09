import React from "react";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  fireEvent,
} from "@testing-library/react";
import {
  getFetchButton,
  getStartBlockElement,
  getEndBlockElement,
  simulateBlockInput,
} from "./test/testUtils";
import { generateTestingUtils } from "eth-testing";
import App from "./App";
import BlockInput from "./components/BlockInput";

describe("App component", () => {
  const testingUtils = generateTestingUtils({ providerType: "MetaMask" });
  const mockedAccount = "0xf61B443A155b07D2b2cAeA2d99715dC84E839EEf";

  beforeAll(() => {
    window.ethereum = testingUtils.getProvider();
  });
  afterEach(() => {
    testingUtils.clearAllMocks();
  });

  describe("web3 not connected", () => {
    it("fetch button disabled when start block is empty", () => {
      const mockSubmit = jest.fn();
      render(<BlockInput onSubmit={mockSubmit} />);

      const fetchButton = getFetchButton();
      expect(fetchButton).toBeDisabled();
    });
  });

  describe("web3 login", () => {
    it("can connect to MetaMask", async () => {
      testingUtils.mockNotConnectedWallet();
      testingUtils.mockRequestAccounts([mockedAccount]);
      render(<App />);
      const connectButton = await screen.findByRole("button", {
        name: /Connect/i,
      });

      // Click the Connect Wallet button
      fireEvent.click(connectButton);
      await waitForElementToBeRemoved(connectButton);

      const expectedElement = screen.queryByText(/Wallet Connected/i);
      expect(expectedElement).toBeInTheDocument();
    });

    describe("web3 connected", () => {
      it("fetch button enabled when web3 connected", async () => {
        testingUtils.mockConnectedWallet([mockedAccount]);

        render(<App />);

        const expectedElement = await screen.findByText(/Wallet Connected/i);
        expect(expectedElement).toBeInTheDocument();
        const fetchButton = getFetchButton();
        expect(fetchButton).not.toBeDisabled();
      });

      it("fetch button disabled after clicked", () => {
        testingUtils.mockConnectedWallet([mockedAccount]);
        render(<App />);
        const startBlockElement = getStartBlockElement();
        const endBlockElement = getEndBlockElement();
        const fetchButton = getFetchButton();
        const [start, end] = ["1", "10"];
        simulateBlockInput(startBlockElement, start);
        simulateBlockInput(endBlockElement, end);
        fireEvent.click(fetchButton);
        expect(fetchButton).toBeDisabled();
      });
    });
  });
});
