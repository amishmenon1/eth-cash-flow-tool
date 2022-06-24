import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import logo from "./images/magnifying-glass-icon.png";
import "./App.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { TransactionContextProvider } from "./components/";
import { BlockInput, Disclaimer, ConnectWalletButton } from "./components";
import {
  connectWallet,
  getEthereumProvider,
  walletIsConnected,
} from "./utils/ethereumUtils";

const App = () => {
  const [web3State, setWeb3State] = useState({
    ethereum: null,
    account: null,
    provider: null,
    connected: false,
  });

  const [blockInputs, setBlockInputs] = useState({
    startBlock: null,
    endBlock: null,
  });

  const [blockInputsDisabled, setBlockInputsDisabled] = useState(false);

  useEffect(() => {
    console.log("App --- useEffect()");
    const { ethereum } = window;
    const provider = getEthereumProvider(ethereum);
    async function loadWeb3State() {
      return walletIsConnected();
    }
    loadWeb3State().then((response) => {
      const { connected, accounts } = response;
      if (!connected) {
        console.warn("Metamask not detected");
        return;
      }
      const account = connected ? accounts[0] : null;
      setWeb3State({
        ethereum,
        provider,
        account,
        connected,
      });
    });
  }, []);

  async function handleConnectWallet() {
    const [ethereum, provider, account] = await connectWallet(setWeb3State);
    setWeb3State({ ethereum, provider, account, connected: true });
  }

  function onBlockInputSubmit(newStart, newEnd) {
    const startBlockChanged = newStart !== blockInputs.startBlock;
    const endBlockChanged = newEnd !== blockInputs.endBlock;
    if (startBlockChanged || endBlockChanged) {
      setBlockInputsDisabled(true);
    }

    setBlockInputs({ startBlock: newStart, endBlock: newEnd });
  }

  const disclaimerMessage = () => {
    const msg = `In order for this app to load successfully, you must have a Metamask
          account that is connected to the Rinkeby testnet (Ethereum).`;
    return msg;
  };
  const styles = {
    blockInput: {
      borderStyle: "outset",
    },
    connected: {
      fontStyle: "italic",
    },
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Ether Cash Flow</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Block Explorer</h1>
      </header>
      <ToastContainer />
      <Row>
        <Col md={10} />
        <Col md={2}>
          {!web3State.connected ? (
            <ConnectWalletButton connectWalletCb={handleConnectWallet} />
          ) : (
            <div style={styles.connected}>
              {" "}
              Wallet Connected: {web3State.account.slice(0, 3)}...
              {web3State.account.slice(-3)}
            </div>
          )}{" "}
        </Col>
      </Row>
      <Row>
        <Col md={2} />
        <Col md={8} style={styles.blockInput}>
          <BlockInput
            onSubmit={onBlockInputSubmit}
            fetchDisabled={blockInputsDisabled}
          />
        </Col>
        <Col md={2} />
      </Row>
      <br />

      <Row>
        <Col md={2} />
        <Col md={8}>
          <TransactionContextProvider
            web3State={web3State}
            blockInputs={blockInputs}
            endStatusCallback={() => setBlockInputsDisabled(false)}
          />
          <Disclaimer message={disclaimerMessage()} />
        </Col>
        <Col md={2} />
      </Row>
    </div>
  );
};

export default App;
