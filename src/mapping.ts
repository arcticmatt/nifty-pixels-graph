import { MarketItem, Transaction } from "../generated/schema"
import {
  MarketItemCreated,
  MarketItemListed,
  MarketItemSold
} from "../generated/Market/Market"

import { Address } from "@graphprotocol/graph-ts";

export function handleMarketItemCreated(event: MarketItemCreated): void {
  const entity = new MarketItem(event.params.itemId.toString());

  entity.creator = event.params.creator;
  entity.itemId = event.params.itemId;
  entity.owner = event.params.owner;
  entity.price = event.params.price;
  entity.seller = event.params.seller;
  entity.sold = event.params.sold;
  entity.tokenId = event.params.tokenId;

  entity.save();

  const transactionEntity = new Transaction(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  transactionEntity.from = event.params.creator;
  transactionEntity.itemId = event.params.itemId;
  transactionEntity.timestamp = event.block.timestamp;
  transactionEntity.to = event.params.owner;
  transactionEntity.tokenId = event.params.tokenId;
  transactionEntity.type = "created";

  transactionEntity.save();
}

export function handleMarketItemListed(event: MarketItemListed): void {
  const entity = new MarketItem(event.params.itemId.toString());

  entity.creator = event.params.creator;
  entity.itemId = event.params.itemId;
  entity.owner = event.params.owner;
  entity.price = event.params.price;
  entity.seller = event.params.seller;
  entity.sold = event.params.sold;
  entity.tokenId = event.params.tokenId;

  entity.save()

  const transactionEntity = new Transaction(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  transactionEntity.from = event.params.seller;
  transactionEntity.itemId = event.params.itemId;
  transactionEntity.timestamp = event.block.timestamp;
  transactionEntity.to = event.params.owner;
  transactionEntity.tokenId = event.params.tokenId;
  transactionEntity.type = "listed";

  transactionEntity.save();
}

export function handleMarketItemSold(event: MarketItemSold): void {
  let entity = MarketItem.load(event.params.itemId.toString());

  if (entity == null) {
    entity = new MarketItem(event.params.itemId.toString());
  }

  entity.creator = event.params.creator;
  entity.itemId = event.params.itemId;
  entity.owner = event.params.owner;
  entity.price = event.params.price;
  entity.seller = Address.fromString('0');
  entity.sold = event.params.sold;
  entity.tokenId = event.params.tokenId;

  entity.previousSellers.push(event.params.seller);

  entity.save()

  const transactionEntity = new Transaction(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  transactionEntity.from = event.params.marketAddress;
  transactionEntity.itemId = event.params.itemId;
  transactionEntity.timestamp = event.block.timestamp;
  transactionEntity.to = event.params.owner;
  transactionEntity.tokenId = event.params.tokenId;
  transactionEntity.type = "sold";

  transactionEntity.save();
}
