/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.77.0
  Forc version: 0.51.1
  Fuel-Core version: 0.22.1
*/

import type {
  BigNumberish,
  BN,
  BytesLike,
  Contract,
  DecodedValue,
  FunctionFragment,
  Interface,
  InvokeFunction,
} from 'fuels';

import type { Enum, Vec } from "./common";

export enum ErrorInput { AccessDenied = 'AccessDenied', NotEnoughFreeCollateralByImRatio = 'NotEnoughFreeCollateralByImRatio', NoMarketFound = 'NoMarketFound' };
export enum ErrorOutput { AccessDenied = 'AccessDenied', NotEnoughFreeCollateralByImRatio = 'NotEnoughFreeCollateralByImRatio', NoMarketFound = 'NoMarketFound' };

export type AccountBalanceInput = { taker_position_size: I64Input, taker_open_notional: I64Input, last_tw_premium_growth_global: I64Input };
export type AccountBalanceOutput = { taker_position_size: I64Output, taker_open_notional: I64Output, last_tw_premium_growth_global: I64Output };
export type AccountBalanceChangeEventInput = { trader: AddressInput, base_token: AssetIdInput, account_balance: AccountBalanceInput };
export type AccountBalanceChangeEventOutput = { trader: AddressOutput, base_token: AssetIdOutput, account_balance: AccountBalanceOutput };
export type AddressInput = { value: string };
export type AddressOutput = AddressInput;
export type AssetIdInput = { value: string };
export type AssetIdOutput = AssetIdInput;
export type I64Input = { value: BigNumberish, negative: boolean };
export type I64Output = { value: BN, negative: boolean };
export type OwedRealizedPnlChangeEventInput = { trader: AddressInput, owed_realized_pnl: I64Input };
export type OwedRealizedPnlChangeEventOutput = { trader: AddressOutput, owed_realized_pnl: I64Output };

export type AccountBalanceAbiConfigurables = {
  DUST: BigNumberish;
  PROXY_ADDRESS: AddressInput;
  FULLY_CLOSED_RATIO: BigNumberish;
  SETTLEMENT_TOKEN: AssetIdInput;
};

interface AccountBalanceAbiInterface extends Interface {
  functions: {
    execute_trade: FunctionFragment;
    modify_owed_realized_pnl: FunctionFragment;
    modify_position: FunctionFragment;
    register_base_token: FunctionFragment;
    settle_all_funding: FunctionFragment;
    settle_bad_debt: FunctionFragment;
    settle_funding: FunctionFragment;
    settle_owed_realized_pnl: FunctionFragment;
    settle_position_in_closed_market: FunctionFragment;
    update_insurance_fund_fee_share: FunctionFragment;
    update_max_funding_rate: FunctionFragment;
    update_protocol_fee_rate: FunctionFragment;
    update_tw_premium_growth_global: FunctionFragment;
    get_account_balance: FunctionFragment;
    get_all_pending_funding_payment: FunctionFragment;
    get_all_trader_positions: FunctionFragment;
    get_base_tokens: FunctionFragment;
    get_funding: FunctionFragment;
    get_funding_delta: FunctionFragment;
    get_funding_growth_global: FunctionFragment;
    get_funding_rate: FunctionFragment;
    get_liquidatable_position_size: FunctionFragment;
    get_margin_requirement: FunctionFragment;
    get_margin_requirement_for_liquidation: FunctionFragment;
    get_pending_funding_payment: FunctionFragment;
    get_pnl: FunctionFragment;
    get_protocol_fee_rate: FunctionFragment;
    get_settlement_token_balance_and_unrealized_pnl: FunctionFragment;
    get_settlement_token_balance_and_unrealized_pnl_by_vault: FunctionFragment;
    get_taker_open_notional: FunctionFragment;
    get_taker_position_size: FunctionFragment;
    get_total_abs_position_value: FunctionFragment;
    get_total_position_value: FunctionFragment;
  };

  encodeFunctionData(functionFragment: 'execute_trade', values: [AddressInput, AddressInput, AssetIdInput, BigNumberish, BigNumberish, I64Input, I64Input, AddressInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'modify_owed_realized_pnl', values: [AddressInput, I64Input]): Uint8Array;
  encodeFunctionData(functionFragment: 'modify_position', values: [AddressInput, AssetIdInput, I64Input, I64Input]): Uint8Array;
  encodeFunctionData(functionFragment: 'register_base_token', values: [AddressInput, AssetIdInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'settle_all_funding', values: [AddressInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'settle_bad_debt', values: [AddressInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'settle_funding', values: [AddressInput, AssetIdInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'settle_owed_realized_pnl', values: [AddressInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'settle_position_in_closed_market', values: [AddressInput, AssetIdInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'update_insurance_fund_fee_share', values: [BigNumberish]): Uint8Array;
  encodeFunctionData(functionFragment: 'update_max_funding_rate', values: [BigNumberish]): Uint8Array;
  encodeFunctionData(functionFragment: 'update_protocol_fee_rate', values: [BigNumberish]): Uint8Array;
  encodeFunctionData(functionFragment: 'update_tw_premium_growth_global', values: [AddressInput, AssetIdInput, I64Input]): Uint8Array;
  encodeFunctionData(functionFragment: 'get_account_balance', values: [AddressInput, AssetIdInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'get_all_pending_funding_payment', values: [AddressInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'get_all_trader_positions', values: [AddressInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'get_base_tokens', values: [AddressInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'get_funding', values: [AssetIdInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'get_funding_delta', values: [BigNumberish, BigNumberish]): Uint8Array;
  encodeFunctionData(functionFragment: 'get_funding_growth_global', values: [AssetIdInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'get_funding_rate', values: [AssetIdInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'get_liquidatable_position_size', values: [AddressInput, AssetIdInput, I64Input]): Uint8Array;
  encodeFunctionData(functionFragment: 'get_margin_requirement', values: [AddressInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'get_margin_requirement_for_liquidation', values: [AddressInput, BigNumberish]): Uint8Array;
  encodeFunctionData(functionFragment: 'get_pending_funding_payment', values: [AddressInput, AssetIdInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'get_pnl', values: [AddressInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'get_protocol_fee_rate', values: []): Uint8Array;
  encodeFunctionData(functionFragment: 'get_settlement_token_balance_and_unrealized_pnl', values: [AddressInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'get_settlement_token_balance_and_unrealized_pnl_by_vault', values: [AddressInput, BigNumberish]): Uint8Array;
  encodeFunctionData(functionFragment: 'get_taker_open_notional', values: [AddressInput, AssetIdInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'get_taker_position_size', values: [AddressInput, AssetIdInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'get_total_abs_position_value', values: [AddressInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'get_total_position_value', values: [AddressInput, AssetIdInput]): Uint8Array;

  decodeFunctionData(functionFragment: 'execute_trade', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'modify_owed_realized_pnl', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'modify_position', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'register_base_token', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'settle_all_funding', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'settle_bad_debt', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'settle_funding', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'settle_owed_realized_pnl', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'settle_position_in_closed_market', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'update_insurance_fund_fee_share', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'update_max_funding_rate', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'update_protocol_fee_rate', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'update_tw_premium_growth_global', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_account_balance', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_all_pending_funding_payment', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_all_trader_positions', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_base_tokens', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_funding', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_funding_delta', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_funding_growth_global', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_funding_rate', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_liquidatable_position_size', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_margin_requirement', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_margin_requirement_for_liquidation', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_pending_funding_payment', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_pnl', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_protocol_fee_rate', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_settlement_token_balance_and_unrealized_pnl', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_settlement_token_balance_and_unrealized_pnl_by_vault', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_taker_open_notional', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_taker_position_size', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_total_abs_position_value', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_total_position_value', data: BytesLike): DecodedValue;
}

export class AccountBalanceAbi extends Contract {
  interface: AccountBalanceAbiInterface;
  functions: {
    execute_trade: InvokeFunction<[sell_trader: AddressInput, buy_trader: AddressInput, base_token: AssetIdInput, trade_amount: BigNumberish, trade_value: BigNumberish, seller_fee: I64Input, buyer_fee: I64Input, matcher: AddressInput], void>;
    modify_owed_realized_pnl: InvokeFunction<[trader: AddressInput, amount: I64Input], void>;
    modify_position: InvokeFunction<[trader: AddressInput, base_token: AssetIdInput, exchanged_position_size: I64Input, exchanged_position_notional: I64Input], void>;
    register_base_token: InvokeFunction<[trader: AddressInput, base_token: AssetIdInput], void>;
    settle_all_funding: InvokeFunction<[trader: AddressInput], void>;
    settle_bad_debt: InvokeFunction<[trader: AddressInput], void>;
    settle_funding: InvokeFunction<[trader: AddressInput, base_token: AssetIdInput], void>;
    settle_owed_realized_pnl: InvokeFunction<[trader: AddressInput], I64Output>;
    settle_position_in_closed_market: InvokeFunction<[trader: AddressInput, base_token: AssetIdInput], [I64Output, I64Output, I64Output, BN]>;
    update_insurance_fund_fee_share: InvokeFunction<[insurance_fund_fee_share: BigNumberish], void>;
    update_max_funding_rate: InvokeFunction<[max_funding_rate: BigNumberish], void>;
    update_protocol_fee_rate: InvokeFunction<[protocol_fee_rate: BigNumberish], void>;
    update_tw_premium_growth_global: InvokeFunction<[trader: AddressInput, base_token: AssetIdInput, last_tw_premium_growth_global: I64Input], void>;
    get_account_balance: InvokeFunction<[trader: AddressInput, base_token: AssetIdInput], AccountBalanceOutput>;
    get_all_pending_funding_payment: InvokeFunction<[trader: AddressInput], I64Output>;
    get_all_trader_positions: InvokeFunction<[trader: AddressInput], Vec<[AssetIdOutput, AccountBalanceOutput]>>;
    get_base_tokens: InvokeFunction<[trader: AddressInput], Vec<AssetIdOutput>>;
    get_funding: InvokeFunction<[token: AssetIdInput], [I64Output, BN]>;
    get_funding_delta: InvokeFunction<[market_twap: BigNumberish, index_twap: BigNumberish], I64Output>;
    get_funding_growth_global: InvokeFunction<[base_token: AssetIdInput], I64Output>;
    get_funding_rate: InvokeFunction<[base_token: AssetIdInput], I64Output>;
    get_liquidatable_position_size: InvokeFunction<[trader: AddressInput, base_token: AssetIdInput, account_value: I64Input], I64Output>;
    get_margin_requirement: InvokeFunction<[trader: AddressInput], BN>;
    get_margin_requirement_for_liquidation: InvokeFunction<[trader: AddressInput, buffer: BigNumberish], BN>;
    get_pending_funding_payment: InvokeFunction<[trader: AddressInput, base_token: AssetIdInput], [I64Output, I64Output]>;
    get_pnl: InvokeFunction<[trader: AddressInput], [I64Output, I64Output]>;
    get_protocol_fee_rate: InvokeFunction<[], BN>;
    get_settlement_token_balance_and_unrealized_pnl: InvokeFunction<[trader: AddressInput], [I64Output, I64Output]>;
    get_settlement_token_balance_and_unrealized_pnl_by_vault: InvokeFunction<[trader: AddressInput, settlement_token_collateral: BigNumberish], [I64Output, I64Output]>;
    get_taker_open_notional: InvokeFunction<[trader: AddressInput, base_token: AssetIdInput], I64Output>;
    get_taker_position_size: InvokeFunction<[trader: AddressInput, base_token: AssetIdInput], I64Output>;
    get_total_abs_position_value: InvokeFunction<[trader: AddressInput], BN>;
    get_total_position_value: InvokeFunction<[trader: AddressInput, base_token: AssetIdInput], I64Output>;
  };
}
