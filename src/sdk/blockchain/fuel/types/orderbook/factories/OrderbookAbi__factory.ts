/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.77.0
  Forc version: 0.51.1
  Fuel-Core version: 0.22.1
*/

import { Interface, Contract, ContractFactory } from "fuels";
import type { Provider, Account, AbstractAddress, BytesLike, DeployContractOptions, StorageSlot } from "fuels";
import type { OrderbookAbi, OrderbookAbiInterface } from "../OrderbookAbi";

const _abi = {
  "types": [
    {
      "typeId": 0,
      "type": "()",
      "components": [],
      "typeParameters": null
    },
    {
      "typeId": 1,
      "type": "(_, _, _)",
      "components": [
        {
          "name": "__tuple_element",
          "type": 10,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 19,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 19,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 2,
      "type": "b256",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 3,
      "type": "bool",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 4,
      "type": "enum Error",
      "components": [
        {
          "name": "AccessDenied",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "NoOrdersFound",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "NoMarketFound",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "OrdersCantBeMatched",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "FirstArgumentShouldBeOrderSellSecondOrderBuy",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "ZeroAssetAmountToSend",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "MarketAlreadyExists",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "BadAsset",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "BadValue",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "BadPrice",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "BaseSizeIsZero",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "CannotRemoveOrderIndex",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "CannotRemoveOrderByTrader",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "CannotRemoveOrder",
          "type": 0,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 5,
      "type": "enum Option",
      "components": [
        {
          "name": "None",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "Some",
          "type": 7,
          "typeArguments": null
        }
      ],
      "typeParameters": [
        7
      ]
    },
    {
      "typeId": 6,
      "type": "enum ReentrancyError",
      "components": [
        {
          "name": "NonReentrant",
          "type": 0,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 7,
      "type": "generic T",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 8,
      "type": "raw untyped ptr",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 9,
      "type": "struct Address",
      "components": [
        {
          "name": "value",
          "type": 2,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 10,
      "type": "struct AssetId",
      "components": [
        {
          "name": "value",
          "type": 2,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 11,
      "type": "struct I64",
      "components": [
        {
          "name": "value",
          "type": 20,
          "typeArguments": null
        },
        {
          "name": "negative",
          "type": 3,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 12,
      "type": "struct Market",
      "components": [
        {
          "name": "asset_id",
          "type": 10,
          "typeArguments": null
        },
        {
          "name": "asset_decimals",
          "type": 19,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 13,
      "type": "struct MarketCreateEvent",
      "components": [
        {
          "name": "asset_id",
          "type": 10,
          "typeArguments": null
        },
        {
          "name": "asset_decimals",
          "type": 19,
          "typeArguments": null
        },
        {
          "name": "timestamp",
          "type": 20,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 14,
      "type": "struct Order",
      "components": [
        {
          "name": "id",
          "type": 2,
          "typeArguments": null
        },
        {
          "name": "trader",
          "type": 9,
          "typeArguments": null
        },
        {
          "name": "base_token",
          "type": 10,
          "typeArguments": null
        },
        {
          "name": "base_size",
          "type": 11,
          "typeArguments": null
        },
        {
          "name": "base_price",
          "type": 20,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 15,
      "type": "struct OrderChangeEvent",
      "components": [
        {
          "name": "order_id",
          "type": 2,
          "typeArguments": null
        },
        {
          "name": "timestamp",
          "type": 20,
          "typeArguments": null
        },
        {
          "name": "order",
          "type": 5,
          "typeArguments": [
            {
              "name": "",
              "type": 14,
              "typeArguments": null
            }
          ]
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 16,
      "type": "struct RawVec",
      "components": [
        {
          "name": "ptr",
          "type": 8,
          "typeArguments": null
        },
        {
          "name": "cap",
          "type": 20,
          "typeArguments": null
        }
      ],
      "typeParameters": [
        7
      ]
    },
    {
      "typeId": 17,
      "type": "struct TradeEvent",
      "components": [
        {
          "name": "base_token",
          "type": 10,
          "typeArguments": null
        },
        {
          "name": "order_matcher",
          "type": 9,
          "typeArguments": null
        },
        {
          "name": "seller",
          "type": 9,
          "typeArguments": null
        },
        {
          "name": "buyer",
          "type": 9,
          "typeArguments": null
        },
        {
          "name": "trade_size",
          "type": 20,
          "typeArguments": null
        },
        {
          "name": "trade_price",
          "type": 20,
          "typeArguments": null
        },
        {
          "name": "sell_order_id",
          "type": 2,
          "typeArguments": null
        },
        {
          "name": "buy_order_id",
          "type": 2,
          "typeArguments": null
        },
        {
          "name": "timestamp",
          "type": 20,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 18,
      "type": "struct Vec",
      "components": [
        {
          "name": "buf",
          "type": 16,
          "typeArguments": [
            {
              "name": "",
              "type": 7,
              "typeArguments": null
            }
          ]
        },
        {
          "name": "len",
          "type": 20,
          "typeArguments": null
        }
      ],
      "typeParameters": [
        7
      ]
    },
    {
      "typeId": 19,
      "type": "u32",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 20,
      "type": "u64",
      "components": null,
      "typeParameters": null
    }
  ],
  "functions": [
    {
      "inputs": [
        {
          "name": "order_id",
          "type": 2,
          "typeArguments": null
        }
      ],
      "name": "cancel_order",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "asset_id",
          "type": 10,
          "typeArguments": null
        },
        {
          "name": "asset_decimals",
          "type": 19,
          "typeArguments": null
        }
      ],
      "name": "create_market",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "get_configurables",
      "output": {
        "name": "",
        "type": 1,
        "typeArguments": null
      },
      "attributes": null
    },
    {
      "inputs": [
        {
          "name": "asset_id",
          "type": 10,
          "typeArguments": null
        }
      ],
      "name": "get_market_by_id",
      "output": {
        "name": "",
        "type": 12,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "asset_id",
          "type": 10,
          "typeArguments": null
        }
      ],
      "name": "market_exists",
      "output": {
        "name": "",
        "type": 3,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "order_sell_id",
          "type": 2,
          "typeArguments": null
        },
        {
          "name": "order_buy_id",
          "type": 2,
          "typeArguments": null
        }
      ],
      "name": "match_orders",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "base_token",
          "type": 10,
          "typeArguments": null
        },
        {
          "name": "base_size",
          "type": 11,
          "typeArguments": null
        },
        {
          "name": "base_price",
          "type": 20,
          "typeArguments": null
        }
      ],
      "name": "open_order",
      "output": {
        "name": "",
        "type": 2,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "payable",
          "arguments": []
        },
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "order",
          "type": 2,
          "typeArguments": null
        }
      ],
      "name": "order_by_id",
      "output": {
        "name": "",
        "type": 5,
        "typeArguments": [
          {
            "name": "",
            "type": 14,
            "typeArguments": null
          }
        ]
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "trader",
          "type": 9,
          "typeArguments": null
        }
      ],
      "name": "orders_by_trader",
      "output": {
        "name": "",
        "type": 18,
        "typeArguments": [
          {
            "name": "",
            "type": 2,
            "typeArguments": null
          }
        ]
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    }
  ],
  "loggedTypes": [
    {
      "logId": 0,
      "loggedType": {
        "name": "",
        "type": 6,
        "typeArguments": []
      }
    },
    {
      "logId": 1,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 2,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 3,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 4,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 5,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 6,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 7,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 8,
      "loggedType": {
        "name": "",
        "type": 15,
        "typeArguments": []
      }
    },
    {
      "logId": 9,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 10,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 11,
      "loggedType": {
        "name": "",
        "type": 13,
        "typeArguments": []
      }
    },
    {
      "logId": 12,
      "loggedType": {
        "name": "",
        "type": 6,
        "typeArguments": []
      }
    },
    {
      "logId": 13,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 14,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 15,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 16,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 17,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 18,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 19,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 20,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 21,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 22,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 23,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 24,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 25,
      "loggedType": {
        "name": "",
        "type": 15,
        "typeArguments": []
      }
    },
    {
      "logId": 26,
      "loggedType": {
        "name": "",
        "type": 15,
        "typeArguments": []
      }
    },
    {
      "logId": 27,
      "loggedType": {
        "name": "",
        "type": 17,
        "typeArguments": []
      }
    },
    {
      "logId": 28,
      "loggedType": {
        "name": "",
        "type": 6,
        "typeArguments": []
      }
    },
    {
      "logId": 29,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 30,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 31,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 32,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 33,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 34,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 35,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 36,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 37,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 38,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 39,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 40,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 41,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 42,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 43,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 44,
      "loggedType": {
        "name": "",
        "type": 4,
        "typeArguments": []
      }
    },
    {
      "logId": 45,
      "loggedType": {
        "name": "",
        "type": 15,
        "typeArguments": []
      }
    }
  ],
  "messagesTypes": [],
  "configurables": [
    {
      "name": "QUOTE_TOKEN",
      "configurableType": {
        "name": "",
        "type": 10,
        "typeArguments": []
      },
      "offset": 102128
    },
    {
      "name": "QUOTE_TOKEN_DECIMALS",
      "configurableType": {
        "name": "",
        "type": 19,
        "typeArguments": null
      },
      "offset": 102064
    },
    {
      "name": "PRICE_DECIMALS",
      "configurableType": {
        "name": "",
        "type": 19,
        "typeArguments": null
      },
      "offset": 102048
    }
  ]
};

const _storageSlots: StorageSlot[] = [];

export class OrderbookAbi__factory {
  static readonly abi = _abi;

  static readonly storageSlots = _storageSlots;

  static createInterface(): OrderbookAbiInterface {
    return new Interface(_abi) as unknown as OrderbookAbiInterface
  }

  static connect(
    id: string | AbstractAddress,
    accountOrProvider: Account | Provider
  ): OrderbookAbi {
    return new Contract(id, _abi, accountOrProvider) as unknown as OrderbookAbi
  }

  static async deployContract(
    bytecode: BytesLike,
    wallet: Account,
    options: DeployContractOptions = {}
  ): Promise<OrderbookAbi> {
    const factory = new ContractFactory(bytecode, _abi, wallet);

    const { storageSlots } = OrderbookAbi__factory;

    const contract = await factory.deployContract({
      storageSlots,
      ...options,
    });

    return contract as unknown as OrderbookAbi;
  }
}
