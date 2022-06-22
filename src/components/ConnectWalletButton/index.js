import React from "react";
import Button from "react-bootstrap/Button";
const ConnectWalletButton = ({ connectWalletCb }) => {
  return (
    <>
      <Button onClick={connectWalletCb} variant="primary">
        Connect Wallet
      </Button>
    </>
  );
};

export default ConnectWalletButton;
