import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import logo from "./images/magnifying-glass-icon.png";
import "./App.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { ethers } from "ethers";
import abi from "./abis/WavePortal.json";
import { TransactionContextProvider } from "./components/";
import { BlockInput, Disclaimer, ConnectWalletButton } from "./components";
import { connectWallet, walletIsConnected } from "./utils/ethereumUtils";

const App = () => {
  const [web3State, setWeb3State] = useState({
    ethereum: null,
    account: null,
    provider: null,
    connected: false,
    contractAddress: "0x665935479A9A6ac151320DC637a27014Df5B44BD",
    contractAbi: abi.abi,
  });

  const [blockInputs, setBlockInputs] = useState({
    startBlock: null,
    endBlock: null,
  });

  useEffect(() => {
    console.log("App --- useEffect()");
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
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

  function onBlockInputSubmit(startBlock, endBlock) {
    setBlockInputs({ startBlock, endBlock });
  }

  const disclaimerMessage = () => {
    const msg = `In order for this app to load successfully, you must have a Metamask
          account that is connected to the Rinkeby testnet (Ethereum).`;
    return msg;
  };
  const styles = {
    blockInput: {
      borderStyle: "outset",
      //TODO: add padding bottom
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
        <Col md={2} />
        <Col md={8} style={styles.blockInput}>
          <BlockInput onSubmit={onBlockInputSubmit} />
        </Col>
        <Col md={2}>
          {!web3State.connected ? (
            <ConnectWalletButton connectWalletCb={handleConnectWallet} />
          ) : (
            <div> Connected</div>
          )}{" "}
        </Col>
      </Row>
      <br />

      <Row>
        <Col md={2} />
        <Col md={8}>
          <TransactionContextProvider
            web3State={web3State}
            blockInputs={blockInputs}
          />
          <Disclaimer message={disclaimerMessage()} />
        </Col>
        <Col md={2} />
      </Row>
    </div>
  );
};

export default App;
