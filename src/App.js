import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import logo from "./images/magnifying-glass-icon.png";
import "./App.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { ethers } from "ethers";
import abi from "./abis/WavePortal.json";
// import TransactionProvider from "./components/Context/TransactionProvider";
import { TransactionContextProvider } from "./components/";
import {
  BlockInput,
  TransactionsTable,
  Disclaimer,
  TotalsPanel,
} from "./components";
import "./utils/ethereumUtils";

const App = () => {
  //Connect Wallet button should make the auth requests
  //pass setCredentials from App as callback after auth
  const [web3State, setWeb3State] = useState({
    ethereum: null,
    account: null,
    contractAddress: "0x665935479A9A6ac151320DC637a27014Df5B44BD",
    contractAbi: abi.abi,
  });

  const [blockInputs, setBlockInputs] = useState({
    startBlock: null,
    endBlock: null,
  });

  useEffect(() => {
    console.log("App --- useEffect()");
    //this needs to be called on button click instead
    const { ethereum } = window;
    const loadWeb3State = async () => {
      console.log("App --- useEffect() --- loadWeb3State");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        console.log(
          "App --- useEffect() --- loadWeb3State --- found an authorized account: ",
          accounts[0]
        );
        setWeb3State({ ethereum, account: accounts[0] });
      } else {
        console.log(
          "App --- useEffect() --- loadWeb3State --- no authorized account found"
        );
        throw new Error("no authorized account found");
      }
    };
    checkIfWalletIsConnected(ethereum);
    loadWeb3State();
    return () => console.log("App useEffect() --- cleanup");
  }, []);

  function checkIfWalletIsConnected(ethereum) {
    console.log("App --- checkIfWalletIsConnected");
    if (!ethereum) {
      console.log(
        "App --- checkIfWalletIsConnected --- no web3 connection found. make sure you have metamask"
      );
      throw new Error("make sure you have metamask");
    } else {
      console.log(
        "App --- checkIfWalletIsConnected --- we have the ethereum object: ",
        ethereum
      );
    }
  }

  const connectWallet = async () => {
    console.log("App --- connectWallet");
    const { ethereum } = web3State;
    if (!ethereum) {
      console.log(
        "App --- connectWallet --- no web3 wallet found. get metamask"
      );
      return;
    }
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log("App --- connectWallet --- Connected: ", accounts[0]);
    setWeb3State({ account: accounts[0] });
  };

  const getCredentials = async () => {
    console.log("App --- getCredentials");
    const { ethereum } = web3State;
    checkIfWalletIsConnected(ethereum);
    const provider = new ethers.providers.Web3Provider(web3State.ethereum);
    const signer = provider.getSigner();
    return [provider, signer];
  };

  const getWaveContract = async () => {
    console.log("App --- getWaveContract");
    const [, signer] = getCredentials();
    const { contractAddress, contractAbi } = web3State;
    const wavePortalContract = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
  };

  const onBlockInputSubmit = (startBlock, endBlock) => {
    setBlockInputs({ startBlock, endBlock });
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
        <Col md={1} />
        <Col md={10} style={styles.blockInput}>
          <BlockInput onSubmit={onBlockInputSubmit} />
        </Col>
        <Col md={1} />
      </Row>
      <br />

      <Row>
        <Col md={1} />
        <Col md={10}>
          {/* <TotalsPanel transactions={[]} /> */}
          <TransactionContextProvider
            web3State={web3State}
            blockInputs={blockInputs}
          />
          {/* <TransactionsTable web3State={web3State} blockInputs={blockInputs} /> */}
          <Disclaimer message={"disclaimer"} />
        </Col>
        <Col md={1} />
      </Row>
    </div>
  );
};

export default App;
