# Nifty Pixels Subgraph

The subgraph for https://github.com/arcticmatt/nifty-pixels.

## Deploying the subgraph locally

1. Make sure the `network` values in `subgraph.yaml` are set to `mainnet`. They need to be set to `mainnet` even though we're testing locally. Copying `subgraph-local.yaml` to `subgraph.yaml` should take care of this step.
1. Make sure the smart contract address values in `subgraph.yaml` are correct and up-to-date.
1. Run a local graph node by following these steps https://thegraph.com/docs/developer/quick-start#2-run-a-local-graph-node. In short, run `cd graph-node/docker` and then run `docker-compose up`.
1. Clone this repo and `cd` into it.
1. Run `yarn create-local` and `yarn deploy-local`. This deploys the subgraph to the local graph node.
1. Go to http://localhost:8000/subgraphs/name/testing1/graphql and run some test queries.

To reset the local graph node, go to the directory that contains the local graph node and run `rm -rf data`. That deletes the node's Postgres database. Also re-run `npx hardhat node`.

## Deploying the subgraph on the Mumbai testnet

1. Make sure the `network` values in `subgraph.yaml` are set to `mumbai`. Copying `subgraph-mumbai.yaml` to `subgraph.yaml` should take care of this step.
1. Make sure files in `abis` folder are up-to-date
1. Change `address` values to use Mumbai contract addresses.
1. Run `yarn codegen && yarn build`
1. Run `graph deploy --studio nifty-pixels-graph`

See https://thegraph.com/docs/developer/deploy-subgraph-studio for general instructions.

## Adding a new data source

1. Add new entry under `dataSources` in `subgraph.yaml`
2. Run `yarn codegen` to generate TypeScript types
3. Add necessary handlers to `mapping.ts`

## Misc

1. Logging & debugging https://thegraph.com/docs/developer/assemblyscript-api#logging-and-debugging