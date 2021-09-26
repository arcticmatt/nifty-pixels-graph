# pixel-art-nft-graph

The subgraph for https://github.com/arcticmatt/pixel-art-nft.

## Running the subgraph locally

1. Run a local graph node by following these steps https://thegraph.com/docs/developer/quick-start#2-run-a-local-graph-node. In short, run `cd graph-node/docker` and then run `docker-compose up`
1. Clone this repo and `cd` into it
1. Run `yarn create-local` and `yarn deploy-local`. This deploys the subgraph to the local graph node
1. Go to http://localhost:8000/subgraphs/name/testing1/graphql and run some test queries

To reset the local graph node, go to the directory that contains the local graph node and run `rm -rf data`. That deletes the node's Postgres database. Also re-run `npx hardhat node`.

## Adding a new data source

1. Add new entry under `dataSources` in `subgraph.yaml`
2. Run `yarn codegen` to generate TypeScript types
3. Add necessary handlers to `mapping.ts`