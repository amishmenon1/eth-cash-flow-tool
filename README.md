# ETH Cash Flow Block Explorer

Deployed site: https://amishmenon1.github.io/eth-cash-flow-tool/

This project is a (condensed) Ethereum block explorer project that analyzes transactions within a given range of blocks. The application integrates with Metamask. Given a range of block numbers, the following data is generated:

1. Total ETH transferred
2. Total # transactions
3. Total # contract addresses
4. A list of total ETH values (Wei), filterable by sender/recipient

# App Flow

User inputs a Start Block (required), and an End Block (optional). If End Block is not provided, the latest block number will be used. The system will collect all blocks and transactions within the given block range. The transaction data will be processed into a list of totals and displayed in a table. The table can be filtered on Sender or Recipient, and the corresponding totals are displayed.

## Cloning and Running the UI Locally

Clone the project into local

Install all the npm packages.

```
cd eth-cash-flow-tool/
npm install
```

In order to run the application, type the following commands

```
cd eth-cash-flow-tool/
npm start
```

The Application Runs on **localhost:3000**

## Developer Docs

### Prerequisites

1. Install Node v16.13.0
   - Refer to https://nodejs.org/en/ to install nodejs
2. Install Ethers.js v5.6.8
   - `npm install ethers@5.6.8`
3. Install Metamask and configure connection to any network

### Work In Progress

1. Unit testing with `react-testing-library`
2. Logging with `react-logger-lib`
3. Remove `console.log` statements

### High Level Component Architecture

![](component-architecture-diagram.png)

## Resources

**create-react-app** :
https://github.com/facebook/create-react-app

**React Bootstrap** : https://react-bootstrap.github.io/getting-started/introduction/

```

```
