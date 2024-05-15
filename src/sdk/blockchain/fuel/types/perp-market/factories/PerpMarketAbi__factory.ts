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
import type { PerpMarketAbi, PerpMarketAbiInterface } from "../PerpMarketAbi";

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
      "type": "(_, _)",
      "components": [
        {
          "name": "__tuple_element",
          "type": 24,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 24,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 2,
      "type": "(_, _)",
      "components": [
        {
          "name": "__tuple_element",
          "type": 9,
          "typeArguments": [
            {
              "name": "",
              "type": 22,
              "typeArguments": null
            }
          ]
        },
        {
          "name": "__tuple_element",
          "type": 9,
          "typeArguments": [
            {
              "name": "",
              "type": 22,
              "typeArguments": null
            }
          ]
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 3,
      "type": "(_, _, _, _)",
      "components": [
        {
          "name": "__tuple_element",
          "type": 14,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 15,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 24,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 24,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 4,
      "type": "(_, _, _, _, _, _, _)",
      "components": [
        {
          "name": "__tuple_element",
          "type": 5,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 5,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 14,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 14,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 15,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 24,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 24,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 5,
      "type": "b256",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 6,
      "type": "bool",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 7,
      "type": "enum Error",
      "components": [
        {
          "name": "AccessDenied",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "FreeCollateralMoreThanZero",
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
          "name": "NoMarketPriceForMarket",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "FirstArgumentShouldBeOrderSellSecondOrderBuy",
          "type": 0,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 8,
      "type": "enum Identity",
      "components": [
        {
          "name": "Address",
          "type": 14,
          "typeArguments": null
        },
        {
          "name": "ContractId",
          "type": 16,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 9,
      "type": "enum Option",
      "components": [
        {
          "name": "None",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "Some",
          "type": 11,
          "typeArguments": null
        }
      ],
      "typeParameters": [
        11
      ]
    },
    {
      "typeId": 10,
      "type": "enum OrderEventIdentifier",
      "components": [
        {
          "name": "OrderOpenEvent",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "OrderRemoveUncollaterizedEvent",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "OrderRemoveEvent",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "OrderRemoveAllEvent",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "OrderMatchEvent",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "OrderFulfillEvent",
          "type": 0,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 11,
      "type": "generic T",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 12,
      "type": "raw untyped ptr",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 13,
      "type": "str",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 14,
      "type": "struct Address",
      "components": [
        {
          "name": "value",
          "type": 5,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 15,
      "type": "struct AssetId",
      "components": [
        {
          "name": "value",
          "type": 5,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 16,
      "type": "struct ContractId",
      "components": [
        {
          "name": "value",
          "type": 5,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 17,
      "type": "struct I64",
      "components": [
        {
          "name": "value",
          "type": 24,
          "typeArguments": null
        },
        {
          "name": "negative",
          "type": 6,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 18,
      "type": "struct Order",
      "components": [
        {
          "name": "id",
          "type": 5,
          "typeArguments": null
        },
        {
          "name": "trader",
          "type": 14,
          "typeArguments": null
        },
        {
          "name": "base_token",
          "type": 15,
          "typeArguments": null
        },
        {
          "name": "base_size",
          "type": 17,
          "typeArguments": null
        },
        {
          "name": "order_price",
          "type": 24,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 19,
      "type": "struct OrderEvent",
      "components": [
        {
          "name": "order_id",
          "type": 5,
          "typeArguments": null
        },
        {
          "name": "order",
          "type": 9,
          "typeArguments": [
            {
              "name": "",
              "type": 18,
              "typeArguments": null
            }
          ]
        },
        {
          "name": "sender",
          "type": 8,
          "typeArguments": null
        },
        {
          "name": "timestamp",
          "type": 24,
          "typeArguments": null
        },
        {
          "name": "identifier",
          "type": 10,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 20,
      "type": "struct RawVec",
      "components": [
        {
          "name": "ptr",
          "type": 12,
          "typeArguments": null
        },
        {
          "name": "cap",
          "type": 24,
          "typeArguments": null
        }
      ],
      "typeParameters": [
        11
      ]
    },
    {
      "typeId": 21,
      "type": "struct TradeEvent",
      "components": [
        {
          "name": "base_token",
          "type": 15,
          "typeArguments": null
        },
        {
          "name": "seller",
          "type": 14,
          "typeArguments": null
        },
        {
          "name": "buyer",
          "type": 14,
          "typeArguments": null
        },
        {
          "name": "trade_size",
          "type": 24,
          "typeArguments": null
        },
        {
          "name": "trade_price",
          "type": 24,
          "typeArguments": null
        },
        {
          "name": "sell_order_id",
          "type": 5,
          "typeArguments": null
        },
        {
          "name": "buy_order_id",
          "type": 5,
          "typeArguments": null
        },
        {
          "name": "timestamp",
          "type": 24,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 22,
      "type": "struct Twap",
      "components": [
        {
          "name": "base_token",
          "type": 15,
          "typeArguments": null
        },
        {
          "name": "span",
          "type": 24,
          "typeArguments": null
        },
        {
          "name": "current_twap",
          "type": 24,
          "typeArguments": null
        },
        {
          "name": "last_update",
          "type": 24,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 23,
      "type": "struct Vec",
      "components": [
        {
          "name": "buf",
          "type": 20,
          "typeArguments": [
            {
              "name": "",
              "type": 11,
              "typeArguments": null
            }
          ]
        },
        {
          "name": "len",
          "type": 24,
          "typeArguments": null
        }
      ],
      "typeParameters": [
        11
      ]
    },
    {
      "typeId": 24,
      "type": "u64",
      "components": null,
      "typeParameters": null
    }
  ],
  "functions": [
    {
      "inputs": [
        {
          "name": "base_size",
          "type": 17,
          "typeArguments": null
        },
        {
          "name": "order_id",
          "type": 5,
          "typeArguments": null
        }
      ],
      "name": "fulfill_order",
      "output": {
        "name": "",
        "type": 3,
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
          "name": "order1_id",
          "type": 5,
          "typeArguments": null
        },
        {
          "name": "order2_id",
          "type": 5,
          "typeArguments": null
        }
      ],
      "name": "match_orders",
      "output": {
        "name": "",
        "type": 4,
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
          "name": "trader",
          "type": 14,
          "typeArguments": null
        },
        {
          "name": "base_token",
          "type": 15,
          "typeArguments": null
        },
        {
          "name": "base_size",
          "type": 17,
          "typeArguments": null
        },
        {
          "name": "order_price",
          "type": 24,
          "typeArguments": null
        }
      ],
      "name": "open_order",
      "output": {
        "name": "",
        "type": 5,
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
          "name": "trader",
          "type": 14,
          "typeArguments": null
        }
      ],
      "name": "remove_all_orders",
      "output": {
        "name": "",
        "type": 23,
        "typeArguments": [
          {
            "name": "",
            "type": 5,
            "typeArguments": null
          }
        ]
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
          "name": "trader",
          "type": 14,
          "typeArguments": null
        },
        {
          "name": "order_id",
          "type": 5,
          "typeArguments": null
        }
      ],
      "name": "remove_order",
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
          "name": "trader",
          "type": 14,
          "typeArguments": null
        }
      ],
      "name": "remove_uncollaterized_orders",
      "output": {
        "name": "",
        "type": 23,
        "typeArguments": [
          {
            "name": "",
            "type": 5,
            "typeArguments": null
          }
        ]
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
          "type": 15,
          "typeArguments": null
        },
        {
          "name": "current_twap",
          "type": 24,
          "typeArguments": null
        }
      ],
      "name": "setup_twap",
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
          "name": "fee_rate",
          "type": 24,
          "typeArguments": null
        }
      ],
      "name": "update_maker_fee_rate",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "mark_span",
          "type": 24,
          "typeArguments": null
        }
      ],
      "name": "update_mark_span",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "market_span",
          "type": 24,
          "typeArguments": null
        }
      ],
      "name": "update_market_span",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "base_token",
          "type": 15,
          "typeArguments": null
        }
      ],
      "name": "get_latest_twap",
      "output": {
        "name": "",
        "type": 1,
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
          "name": "token",
          "type": 15,
          "typeArguments": null
        }
      ],
      "name": "get_mark_price",
      "output": {
        "name": "",
        "type": 24,
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
          "name": "token",
          "type": 15,
          "typeArguments": null
        }
      ],
      "name": "get_market_price",
      "output": {
        "name": "",
        "type": 24,
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
          "name": "trader",
          "type": 14,
          "typeArguments": null
        },
        {
          "name": "base_token",
          "type": 15,
          "typeArguments": null
        }
      ],
      "name": "get_total_trader_order_base",
      "output": {
        "name": "",
        "type": 17,
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
          "name": "trader",
          "type": 14,
          "typeArguments": null
        },
        {
          "name": "base_token",
          "type": 15,
          "typeArguments": null
        }
      ],
      "name": "get_trader_orders",
      "output": {
        "name": "",
        "type": 23,
        "typeArguments": [
          {
            "name": "",
            "type": 18,
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
          "name": "base_token",
          "type": 15,
          "typeArguments": null
        }
      ],
      "name": "get_twaps",
      "output": {
        "name": "",
        "type": 2,
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
          "name": "trader",
          "type": 14,
          "typeArguments": null
        }
      ],
      "name": "has_active_orders",
      "output": {
        "name": "",
        "type": 6,
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
          "name": "trader",
          "type": 14,
          "typeArguments": null
        },
        {
          "name": "base_token",
          "type": 15,
          "typeArguments": null
        }
      ],
      "name": "has_active_orders_by_token",
      "output": {
        "name": "",
        "type": 6,
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
    }
  ],
  "loggedTypes": [
    {
      "logId": 0,
      "loggedType": {
        "name": "",
        "type": 7,
        "typeArguments": []
      }
    },
    {
      "logId": 1,
      "loggedType": {
        "name": "",
        "type": 7,
        "typeArguments": []
      }
    },
    {
      "logId": 2,
      "loggedType": {
        "name": "",
        "type": 13,
        "typeArguments": null
      }
    },
    {
      "logId": 3,
      "loggedType": {
        "name": "",
        "type": 19,
        "typeArguments": []
      }
    },
    {
      "logId": 4,
      "loggedType": {
        "name": "",
        "type": 21,
        "typeArguments": []
      }
    },
    {
      "logId": 5,
      "loggedType": {
        "name": "",
        "type": 7,
        "typeArguments": []
      }
    },
    {
      "logId": 6,
      "loggedType": {
        "name": "",
        "type": 7,
        "typeArguments": []
      }
    },
    {
      "logId": 7,
      "loggedType": {
        "name": "",
        "type": 7,
        "typeArguments": []
      }
    },
    {
      "logId": 8,
      "loggedType": {
        "name": "",
        "type": 19,
        "typeArguments": []
      }
    },
    {
      "logId": 9,
      "loggedType": {
        "name": "",
        "type": 19,
        "typeArguments": []
      }
    },
    {
      "logId": 10,
      "loggedType": {
        "name": "",
        "type": 21,
        "typeArguments": []
      }
    },
    {
      "logId": 11,
      "loggedType": {
        "name": "",
        "type": 7,
        "typeArguments": []
      }
    },
    {
      "logId": 12,
      "loggedType": {
        "name": "",
        "type": 19,
        "typeArguments": []
      }
    },
    {
      "logId": 13,
      "loggedType": {
        "name": "",
        "type": 7,
        "typeArguments": []
      }
    },
    {
      "logId": 14,
      "loggedType": {
        "name": "",
        "type": 19,
        "typeArguments": []
      }
    },
    {
      "logId": 15,
      "loggedType": {
        "name": "",
        "type": 7,
        "typeArguments": []
      }
    },
    {
      "logId": 16,
      "loggedType": {
        "name": "",
        "type": 7,
        "typeArguments": []
      }
    },
    {
      "logId": 17,
      "loggedType": {
        "name": "",
        "type": 19,
        "typeArguments": []
      }
    },
    {
      "logId": 18,
      "loggedType": {
        "name": "",
        "type": 7,
        "typeArguments": []
      }
    },
    {
      "logId": 19,
      "loggedType": {
        "name": "",
        "type": 7,
        "typeArguments": []
      }
    },
    {
      "logId": 20,
      "loggedType": {
        "name": "",
        "type": 19,
        "typeArguments": []
      }
    },
    {
      "logId": 21,
      "loggedType": {
        "name": "",
        "type": 7,
        "typeArguments": []
      }
    },
    {
      "logId": 22,
      "loggedType": {
        "name": "",
        "type": 13,
        "typeArguments": null
      }
    },
    {
      "logId": 23,
      "loggedType": {
        "name": "",
        "type": 7,
        "typeArguments": []
      }
    },
    {
      "logId": 24,
      "loggedType": {
        "name": "",
        "type": 7,
        "typeArguments": []
      }
    },
    {
      "logId": 25,
      "loggedType": {
        "name": "",
        "type": 7,
        "typeArguments": []
      }
    },
    {
      "logId": 26,
      "loggedType": {
        "name": "",
        "type": 7,
        "typeArguments": []
      }
    }
  ],
  "messagesTypes": [],
  "configurables": [
    {
      "name": "OWNER",
      "configurableType": {
        "name": "",
        "type": 14,
        "typeArguments": []
      },
      "offset": 140696
    },
    {
      "name": "PROXY_ADDRESS",
      "configurableType": {
        "name": "",
        "type": 14,
        "typeArguments": []
      },
      "offset": 140264
    },
    {
      "name": "DUST",
      "configurableType": {
        "name": "",
        "type": 24,
        "typeArguments": null
      },
      "offset": 140480
    }
  ]
};

const _storageSlots: StorageSlot[] = [
  {
    "key": "7f91d1a929dce734e7f930bbb279ccfccdb5474227502ea8845815c74bd930a7",
    "value": "0000000000000384000000000000000000000000000000000000000000000000"
  },
  {
    "key": "8a89a0cce819e0426e565819a9a98711329087da5a802fb16edd223c47fa44ef",
    "value": "00000000000001f4000000000000000000000000000000000000000000000000"
  },
  {
    "key": "94b2b70d20da552763c7614981b2a4d984380d7ed4e54c01b28c914e79e44bd5",
    "value": "0000000000000e10000000000000000000000000000000000000000000000000"
  }
];

export class PerpMarketAbi__factory {
  static readonly abi = _abi;

  static readonly storageSlots = _storageSlots;

  static createInterface(): PerpMarketAbiInterface {
    return new Interface(_abi) as unknown as PerpMarketAbiInterface
  }

  static connect(
    id: string | AbstractAddress,
    accountOrProvider: Account | Provider
  ): PerpMarketAbi {
    return new Contract(id, _abi, accountOrProvider) as unknown as PerpMarketAbi
  }

  static async deployContract(
    bytecode: BytesLike,
    wallet: Account,
    options: DeployContractOptions = {}
  ): Promise<PerpMarketAbi> {
    const factory = new ContractFactory(bytecode, _abi, wallet);

    const { storageSlots } = PerpMarketAbi__factory;

    const contract = await factory.deployContract({
      storageSlots,
      ...options,
    });

    return contract as unknown as PerpMarketAbi;
  }
}
