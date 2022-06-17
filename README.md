# ETH Cash Flow Block Explorer

This project is a (condensed) Ethereum block explorer project that analyzes transactions wthin a given range of blocks. The application runs on the Rinkeby testnet. Given a range of block numbers, the following data is generated:

1. Total ETH transferred
2. Total # transactions
3. Total # contract addresses
4. A list of total ETH values (Wei) by sender/recipient

# App Flow

User inputs a Start Block (required), and an End Block (optional). If End Block is not provided, the latest block number will be used. The system will collect all blocks and transactions within the given block range. The transaction data will be processed into a list of totals and displayed in a table. The table can be filtered on Sender or Recipient, and the corresponding totals are displayed.

## Cloning and Running the UI Locally

Clone the project into local

Install all the npm packages. Go into the project folder and type the following command to install all npm packages

```
npm install
```

In order to run the application, type the following commands

```
cd eth-block-explorer/
npm start
```

The Application Runs on **localhost:3000**

## Developer Docs

### Prerequisites

1. Install Node v17+
   - Refer to https://nodejs.org/en/ to install nodejs
2. Install Web3 (web3@3.0.0-rc.5)
   - `npm install web3@3.0.0-rc.5`
3. Install Truffle (I used 5.0.0)
   - `npm install truffle@5.0.0`
4. Install Ganache CLI
   - `npm install ganache-cli`
5. Install HDWallet Provider
   - `npm install @truffle/hdwallet-provider`
6. Register for Infura account and set up node on Rinkeby network (ETH testnet)
7. Install dotenv
   - `npm install dotenv`
8. Install Metamask and configure connection to Rinkeby testnet

```

## Resources

**create-react-app** :
https://github.com/facebook/create-react-app

**React Bootstrap** : https://react-bootstrap.github.io/getting-started/introduction/
```
