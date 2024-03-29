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
  console.log("App component -- render");
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
    console.log("App --- useEffect() -- render");
    const { ethereum } = window;
    const provider = getEthereumProvider(ethereum);
    async function loadWeb3State() {
      return walletIsConnected();
    }
    loadWeb3State().then((response) => {
      const { connected, accounts } = response;
      setBlockInputsDisabled(!connected);
      if (!connected || !accounts) {
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

  useEffect(() => {
    setBlockInputsDisabled(!web3State.connected);
  }, [web3State.connected]);

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
    const msg = `In order for this app to work successfully, you must have a Metamask or Web3 provider
          account setup.`;
    return msg;
  };
  const styles = {
    blockInput: {
      borderStyle: "outset",
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
          <ConnectWalletButton
            web3State={web3State}
            connectWalletCb={handleConnectWallet}
          />
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
        </Col>
        <Col md={2} />
      </Row>
      <footer className="App-footer" style={{ marginTop: "20px" }}>
        <Disclaimer message={disclaimerMessage()} />
      </footer>
    </div>
  );
};

export default App;
