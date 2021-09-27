import { MarketItem, Transaction } from "../generated/schema"
import {
  MarketItemCreated,
  MarketItemListed,
  MarketItemSold
} from "../generated/Market/Market"

import { Address } from "@graphprotocol/graph-ts";
import {
  BigInt
} from "@graphprotocol/graph-ts";
import {
  Minted
} from "../generated/NFT/NFT"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function handleMinted(event: Minted): void {
  const entity = new MarketItem(event.params.tokenId.toString());

  // Since NFT is not listed yet, we use the zero address for a lot of things.
  entity.creator = event.params.to;
  entity.itemId = BigInt.fromString("0");
  entity.owner = event.params.to;
  entity.price = BigInt.fromString("0");
  entity.seller = Address.fromString(ZERO_ADDRESS);
  entity.sold = false;
  entity.tokenId = event.params.tokenId;
  entity.tokenUri = event.params.tokenURI;

  entity.save();

  const transactionEntity = new Transaction(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  transactionEntity.creator = event.params.to;
  transactionEntity.from = Address.fromString(ZERO_ADDRESS);
  transactionEntity.itemId = BigInt.fromString("0");
  transactionEntity.timestamp = event.block.timestamp;
  transactionEntity.to = event.params.to;
  transactionEntity.tokenId = event.params.tokenId;
  transactionEntity.tokenUri = event.params.tokenURI;
  transactionEntity.type = "minted";

  transactionEntity.save();
}

export function handleMarketItemCreated(event: MarketItemCreated): void {
  const entity = new MarketItem(event.params.tokenId.toString());

  entity.creator = event.params.creator;
  entity.itemId = event.params.itemId;
  entity.owner = event.params.owner;
  entity.price = event.params.price;
  entity.seller = event.params.seller;
  entity.sold = event.params.sold;
  entity.tokenId = event.params.tokenId;
  entity.tokenUri = event.params.tokenUri;

  entity.save();

  const transactionEntity = new Transaction(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  transactionEntity.creator = event.params.creator;
  transactionEntity.from = event.params.creator;
  transactionEntity.itemId = event.params.itemId;
  transactionEntity.price = event.params.price;
  transactionEntity.timestamp = event.block.timestamp;
  transactionEntity.to = event.params.owner;
  transactionEntity.tokenId = event.params.tokenId;
  transactionEntity.tokenUri = event.params.tokenUri;
  transactionEntity.type = "listed";

  transactionEntity.save();
}

export function handleMarketItemListed(event: MarketItemListed): void {
  const entity = new MarketItem(event.params.tokenId.toString());

  entity.creator = event.params.creator;
  entity.itemId = event.params.itemId;
  entity.owner = event.params.owner;
  entity.price = event.params.price;
  entity.seller = event.params.seller;
  entity.sold = event.params.sold;
  entity.tokenId = event.params.tokenId;

  entity.save()

  const transactionEntity = new Transaction(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  transactionEntity.creator = event.params.creator;
  transactionEntity.from = event.params.seller;
  transactionEntity.itemId = event.params.itemId;
  transactionEntity.price = event.params.price;
  transactionEntity.timestamp = event.block.timestamp;
  transactionEntity.to = event.params.owner;
  transactionEntity.tokenId = event.params.tokenId;
  transactionEntity.tokenUri = entity.tokenUri;
  transactionEntity.type = "listed";

  transactionEntity.save();
}

export function handleMarketItemSold(event: MarketItemSold): void {
  let entity = MarketItem.load(event.params.tokenId.toString());

  if (entity == null) {
    entity = new MarketItem(event.params.tokenId.toString());
  }

  entity.creator = event.params.creator;
  entity.itemId = event.params.itemId;
  entity.owner = event.params.owner;
  entity.price = event.params.price;
  entity.seller = Address.fromString(ZERO_ADDRESS);
  entity.sold = event.params.sold;
  entity.tokenId = event.params.tokenId;

  if (entity.previousSellers == null) {
    entity.previousSellers = [event.params.seller];
  } else {
    entity.previousSellers.push(event.params.seller);
  }

  entity.save()

  const transactionEntity = new Transaction(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  transactionEntity.creator = event.params.creator;
  transactionEntity.from = event.params.marketAddress;
  transactionEntity.itemId = event.params.itemId;
  transactionEntity.price = event.params.price;
  transactionEntity.timestamp = event.block.timestamp;
  transactionEntity.to = event.params.owner;
  transactionEntity.tokenId = event.params.tokenId;
  transactionEntity.tokenUri = entity.tokenUri;
  transactionEntity.type = "sold";

  transactionEntity.save();
}
