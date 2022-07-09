import React from "react";
import Button from "react-bootstrap/Button";

const ConnectWalletButton = ({ web3State, connectWalletCb }) => {
  const styles = {
    connected: {
      fontStyle: "italic",
    },
  };

  return !web3State.connected ? (
    <>
      <Button onClick={connectWalletCb} variant="primary">
        Connect Wallet
      </Button>
    </>
  ) : (
    <div style={styles.connected}>
      {" "}
      Wallet Connected: {web3State.account.slice(0, 3)}...
      {web3State.account.slice(-3)}
    </div>
  );
};

export default ConnectWalletButton;
