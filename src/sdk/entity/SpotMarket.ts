import { makeAutoObservable } from "mobx";

import { BlockchainNetworkFactory } from "../blockchain/BlockchainNetworkFactory";
import { DEFAULT_DECIMALS } from "../constants";
import BN from "../utils/BN";

import { Token } from "./Token";

export class SpotMarket {
  readonly baseToken: Token;
  readonly quoteToken: Token;

  price: BN = BN.ZERO;
  setPrice = (price: BN) => (this.price = price);

  constructor(baseToken: string, quoteToken: string) {
    const bcNetwork = BlockchainNetworkFactory.getInstance().currentInstance!;

    this.baseToken = bcNetwork.getTokenByAssetId(baseToken);
    this.quoteToken = bcNetwork.getTokenByAssetId(quoteToken);
    makeAutoObservable(this);
  }

  get symbol(): string {
    return `${this.baseToken.symbol}-${this.quoteToken.symbol}`;
  }

  get priceUnits(): BN {
    return BN.formatUnits(this.price, DEFAULT_DECIMALS);
  }
}
