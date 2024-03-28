# Spark Orderbook Indexer Synchronizer

This repository contains a server that updates data from the Envio indexer and stores it in a database.

## Tests

Within the repository, you can find the test file: `test-cases/data_encode.test.ts`, which contains 2 tests:

- **"should emit and decode data"**: This test deploys the orderbook contract, saves the contract ID and start block into the `addresses.json` file, emits all types of events from the Envio indexer, and decodes the data.

- **"should decode data"**: This test retrieves a block and contract ID from `addresses.json` and decodes the logs.

## How to Run

Follow these steps to clone the repository, set up your environment, build the contracts, and run the tests:

1. **Clone the Repository and install dependencies**
   ```
   git clone git@github.com:compolabs/orderbook-indexer-synchronizer.git
   cd orderbook-indexer-synchronizer
   npm i
   ```

2. **Create a `.env` File**
   Add your private key to the `.env` file.
   ```
   echo "ALICE=<YOUR PRIVATE KEY>" >> .env
   ```

3. **Build Contracts**
   Compile the smart contracts.
   ```
   forc build
   ```

4. **Run Tests**
   Execute the test suite.
   ```
   npm run test
   ```


```
git clone git@github.com:compolabs/orderbook-indexer-synchronizer.git
cd orderbook-indexer-synchronizer
npm i
echo "ALICE=YOUR_PK" >> .env
forc build
npm run test
```
