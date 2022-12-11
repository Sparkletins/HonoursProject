# Blockchain Degree Validation
## Overview
This project aims to validate academic degrees using the Ethereum blockchain as the back end. Each degree is written to the blockchain. This is done by writing key information for the degree such as name of degree, institution and the image hash. A corresponding image of the degree is stored on the IPFS (Inter-Planetary File System) Network. This image is then accessed using the image hash written to the blockchain.
## Required Software
The software required to run this application is as follows:
- Truffle
- Ganache
- Metamask
- React

Truffle can be installed by:
```bash
npm install truffle -g
```
## Usage
- Run a Ganache local blockchain
- Deploy the contracts using
```bash
truffle migrate
```
- Create and run the React web app using 
```bash
npm install --save ipfs-http-client
npm start
```
- Import the first account from Ganache into the metamask wallet
- Import another account from Ganache into the metamask wallet
## Links to Software
- Truffle and Ganache: https://trufflesuite.com/
- MetaMask: https://metamask.io/
