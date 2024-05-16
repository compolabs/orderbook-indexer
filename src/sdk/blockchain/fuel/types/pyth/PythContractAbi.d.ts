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
  Bytes,
  BytesLike,
  Contract,
  DecodedValue,
  FunctionFragment,
  Interface,
  InvokeFunction,
} from 'fuels';

import type { Enum, Vec } from "./common";

export enum AccessErrorInput { NotOwner = 'NotOwner' };
export enum AccessErrorOutput { NotOwner = 'NotOwner' };
export type IdentityInput = Enum<{ Address: AddressInput, ContractId: ContractIdInput }>;
export type IdentityOutput = Enum<{ Address: AddressOutput, ContractId: ContractIdOutput }>;
export enum InitializationErrorInput { CannotReinitialized = 'CannotReinitialized' };
export enum InitializationErrorOutput { CannotReinitialized = 'CannotReinitialized' };
export enum PythErrorInput { FeesCanOnlyBePaidInTheBaseAsset = 'FeesCanOnlyBePaidInTheBaseAsset', GuardianSetNotFound = 'GuardianSetNotFound', IncorrectMessageType = 'IncorrectMessageType', InsufficientFee = 'InsufficientFee', InvalidArgument = 'InvalidArgument', InvalidAttestationSize = 'InvalidAttestationSize', InvalidDataSourcesLength = 'InvalidDataSourcesLength', InvalidExponent = 'InvalidExponent', InvalidHeaderSize = 'InvalidHeaderSize', InvalidMagic = 'InvalidMagic', InvalidMajorVersion = 'InvalidMajorVersion', InvalidMinorVersion = 'InvalidMinorVersion', InvalidPayloadId = 'InvalidPayloadId', InvalidPayloadLength = 'InvalidPayloadLength', InvalidPriceFeedDataLength = 'InvalidPriceFeedDataLength', InvalidProof = 'InvalidProof', InvalidUpdateData = 'InvalidUpdateData', InvalidUpdateDataLength = 'InvalidUpdateDataLength', InvalidUpdateDataSource = 'InvalidUpdateDataSource', InvalidUpgradeModule = 'InvalidUpgradeModule', LengthOfPriceFeedIdsAndPublishTimesMustMatch = 'LengthOfPriceFeedIdsAndPublishTimesMustMatch', NewGuardianSetIsEmpty = 'NewGuardianSetIsEmpty', NumberOfUpdatesIrretrievable = 'NumberOfUpdatesIrretrievable', OutdatedPrice = 'OutdatedPrice', PriceFeedNotFound = 'PriceFeedNotFound', PriceFeedNotFoundWithinRange = 'PriceFeedNotFoundWithinRange', WormholeGovernanceActionNotFound = 'WormholeGovernanceActionNotFound' };
export enum PythErrorOutput { FeesCanOnlyBePaidInTheBaseAsset = 'FeesCanOnlyBePaidInTheBaseAsset', GuardianSetNotFound = 'GuardianSetNotFound', IncorrectMessageType = 'IncorrectMessageType', InsufficientFee = 'InsufficientFee', InvalidArgument = 'InvalidArgument', InvalidAttestationSize = 'InvalidAttestationSize', InvalidDataSourcesLength = 'InvalidDataSourcesLength', InvalidExponent = 'InvalidExponent', InvalidHeaderSize = 'InvalidHeaderSize', InvalidMagic = 'InvalidMagic', InvalidMajorVersion = 'InvalidMajorVersion', InvalidMinorVersion = 'InvalidMinorVersion', InvalidPayloadId = 'InvalidPayloadId', InvalidPayloadLength = 'InvalidPayloadLength', InvalidPriceFeedDataLength = 'InvalidPriceFeedDataLength', InvalidProof = 'InvalidProof', InvalidUpdateData = 'InvalidUpdateData', InvalidUpdateDataLength = 'InvalidUpdateDataLength', InvalidUpdateDataSource = 'InvalidUpdateDataSource', InvalidUpgradeModule = 'InvalidUpgradeModule', LengthOfPriceFeedIdsAndPublishTimesMustMatch = 'LengthOfPriceFeedIdsAndPublishTimesMustMatch', NewGuardianSetIsEmpty = 'NewGuardianSetIsEmpty', NumberOfUpdatesIrretrievable = 'NumberOfUpdatesIrretrievable', OutdatedPrice = 'OutdatedPrice', PriceFeedNotFound = 'PriceFeedNotFound', PriceFeedNotFoundWithinRange = 'PriceFeedNotFoundWithinRange', WormholeGovernanceActionNotFound = 'WormholeGovernanceActionNotFound' };
export type StateInput = Enum<{ Uninitialized: [], Initialized: IdentityInput, Revoked: [] }>;
export type StateOutput = Enum<{ Uninitialized: [], Initialized: IdentityOutput, Revoked: [] }>;
export enum WormholeErrorInput { ConsistencyLevelIrretrievable = 'ConsistencyLevelIrretrievable', GovernanceActionAlreadyConsumed = 'GovernanceActionAlreadyConsumed', GuardianIndexIrretrievable = 'GuardianIndexIrretrievable', GuardianSetHasExpired = 'GuardianSetHasExpired', GuardianSetKeyIrretrievable = 'GuardianSetKeyIrretrievable', GuardianSetNotFound = 'GuardianSetNotFound', InvalidGovernanceAction = 'InvalidGovernanceAction', InvalidGovernanceChain = 'InvalidGovernanceChain', InvalidGovernanceContract = 'InvalidGovernanceContract', InvalidGuardianSet = 'InvalidGuardianSet', InvalidGuardianSetKeysLength = 'InvalidGuardianSetKeysLength', InvalidGuardianSetUpgrade = 'InvalidGuardianSetUpgrade', InvalidGuardianSetUpgradeLength = 'InvalidGuardianSetUpgradeLength', InvalidModule = 'InvalidModule', InvalidPayloadLength = 'InvalidPayloadLength', InvalidSignatureLength = 'InvalidSignatureLength', InvalidUpdateDataSource = 'InvalidUpdateDataSource', NewGuardianSetIsEmpty = 'NewGuardianSetIsEmpty', NewGuardianSetIndexIsInvalid = 'NewGuardianSetIndexIsInvalid', NoQuorum = 'NoQuorum', NotSignedByCurrentGuardianSet = 'NotSignedByCurrentGuardianSet', SignatureInvalid = 'SignatureInvalid', SignatureIndicesNotAscending = 'SignatureIndicesNotAscending', SignatureVIrretrievable = 'SignatureVIrretrievable', SignersLengthIrretrievable = 'SignersLengthIrretrievable', VMSignatureInvalid = 'VMSignatureInvalid', VMVersionIncompatible = 'VMVersionIncompatible' };
export enum WormholeErrorOutput { ConsistencyLevelIrretrievable = 'ConsistencyLevelIrretrievable', GovernanceActionAlreadyConsumed = 'GovernanceActionAlreadyConsumed', GuardianIndexIrretrievable = 'GuardianIndexIrretrievable', GuardianSetHasExpired = 'GuardianSetHasExpired', GuardianSetKeyIrretrievable = 'GuardianSetKeyIrretrievable', GuardianSetNotFound = 'GuardianSetNotFound', InvalidGovernanceAction = 'InvalidGovernanceAction', InvalidGovernanceChain = 'InvalidGovernanceChain', InvalidGovernanceContract = 'InvalidGovernanceContract', InvalidGuardianSet = 'InvalidGuardianSet', InvalidGuardianSetKeysLength = 'InvalidGuardianSetKeysLength', InvalidGuardianSetUpgrade = 'InvalidGuardianSetUpgrade', InvalidGuardianSetUpgradeLength = 'InvalidGuardianSetUpgradeLength', InvalidModule = 'InvalidModule', InvalidPayloadLength = 'InvalidPayloadLength', InvalidSignatureLength = 'InvalidSignatureLength', InvalidUpdateDataSource = 'InvalidUpdateDataSource', NewGuardianSetIsEmpty = 'NewGuardianSetIsEmpty', NewGuardianSetIndexIsInvalid = 'NewGuardianSetIndexIsInvalid', NoQuorum = 'NoQuorum', NotSignedByCurrentGuardianSet = 'NotSignedByCurrentGuardianSet', SignatureInvalid = 'SignatureInvalid', SignatureIndicesNotAscending = 'SignatureIndicesNotAscending', SignatureVIrretrievable = 'SignatureVIrretrievable', SignersLengthIrretrievable = 'SignersLengthIrretrievable', VMSignatureInvalid = 'VMSignatureInvalid', VMVersionIncompatible = 'VMVersionIncompatible' };

export type AddressInput = { value: string };
export type AddressOutput = AddressInput;
export type ConstructedEventInput = { guardian_set_index: BigNumberish };
export type ConstructedEventOutput = { guardian_set_index: number };
export type ContractIdInput = { value: string };
export type ContractIdOutput = ContractIdInput;
export type DataSourceInput = { chain_id: BigNumberish, emitter_address: string };
export type DataSourceOutput = { chain_id: number, emitter_address: string };
export type GuardianSetInput = { expiration_time: BigNumberish, keys: Vec<string> };
export type GuardianSetOutput = { expiration_time: BN, keys: Vec<string> };
export type NewGuardianSetEventInput = { governance_action_hash: string, new_guardian_set_index: BigNumberish };
export type NewGuardianSetEventOutput = { governance_action_hash: string, new_guardian_set_index: number };
export type OwnershipRenouncedInput = { previous_owner: IdentityInput };
export type OwnershipRenouncedOutput = { previous_owner: IdentityOutput };
export type OwnershipSetInput = { new_owner: IdentityInput };
export type OwnershipSetOutput = { new_owner: IdentityOutput };
export type PriceInput = { confidence: BigNumberish, exponent: BigNumberish, price: BigNumberish, publish_time: BigNumberish };
export type PriceOutput = { confidence: BN, exponent: number, price: BN, publish_time: BN };
export type PriceFeedInput = { ema_price: PriceInput, id: string, price: PriceInput };
export type PriceFeedOutput = { ema_price: PriceOutput, id: string, price: PriceOutput };
export type RawBytesInput = { ptr: BigNumberish, cap: BigNumberish };
export type RawBytesOutput = { ptr: BN, cap: BN };
export type WormholeProviderInput = { governance_chain_id: BigNumberish, governance_contract: string };
export type WormholeProviderOutput = { governance_chain_id: number, governance_contract: string };

export type PythContractAbiConfigurables = {
  DEPLOYER: IdentityInput;
};

interface PythContractAbiInterface extends Interface {
  functions: {
    owner: FunctionFragment;
    ema_price: FunctionFragment;
    ema_price_no_older_than: FunctionFragment;
    ema_price_unsafe: FunctionFragment;
    parse_price_feed_updates: FunctionFragment;
    price: FunctionFragment;
    price_no_older_than: FunctionFragment;
    price_unsafe: FunctionFragment;
    update_fee: FunctionFragment;
    update_price_feeds: FunctionFragment;
    update_price_feeds_if_necessary: FunctionFragment;
    valid_time_period: FunctionFragment;
    constructor: FunctionFragment;
    latest_publish_time: FunctionFragment;
    price_feed_exists: FunctionFragment;
    price_feed_unsafe: FunctionFragment;
    single_update_fee: FunctionFragment;
    valid_data_source: FunctionFragment;
    valid_data_sources: FunctionFragment;
    current_guardian_set_index: FunctionFragment;
    current_wormhole_provider: FunctionFragment;
    governance_action_is_consumed: FunctionFragment;
    guardian_set: FunctionFragment;
    submit_new_guardian_set: FunctionFragment;
  };

  encodeFunctionData(functionFragment: 'owner', values: []): Uint8Array;
  encodeFunctionData(functionFragment: 'ema_price', values: [string]): Uint8Array;
  encodeFunctionData(functionFragment: 'ema_price_no_older_than', values: [BigNumberish, string]): Uint8Array;
  encodeFunctionData(functionFragment: 'ema_price_unsafe', values: [string]): Uint8Array;
  encodeFunctionData(functionFragment: 'parse_price_feed_updates', values: [BigNumberish, BigNumberish, Vec<string>, Vec<Bytes>]): Uint8Array;
  encodeFunctionData(functionFragment: 'price', values: [string]): Uint8Array;
  encodeFunctionData(functionFragment: 'price_no_older_than', values: [BigNumberish, string]): Uint8Array;
  encodeFunctionData(functionFragment: 'price_unsafe', values: [string]): Uint8Array;
  encodeFunctionData(functionFragment: 'update_fee', values: [Vec<Bytes>]): Uint8Array;
  encodeFunctionData(functionFragment: 'update_price_feeds', values: [Vec<Bytes>]): Uint8Array;
  encodeFunctionData(functionFragment: 'update_price_feeds_if_necessary', values: [Vec<string>, Vec<BigNumberish>, Vec<Bytes>]): Uint8Array;
  encodeFunctionData(functionFragment: 'valid_time_period', values: []): Uint8Array;
  encodeFunctionData(functionFragment: 'constructor', values: [Vec<DataSourceInput>, BigNumberish, BigNumberish, Bytes]): Uint8Array;
  encodeFunctionData(functionFragment: 'latest_publish_time', values: [string]): Uint8Array;
  encodeFunctionData(functionFragment: 'price_feed_exists', values: [string]): Uint8Array;
  encodeFunctionData(functionFragment: 'price_feed_unsafe', values: [string]): Uint8Array;
  encodeFunctionData(functionFragment: 'single_update_fee', values: []): Uint8Array;
  encodeFunctionData(functionFragment: 'valid_data_source', values: [DataSourceInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'valid_data_sources', values: []): Uint8Array;
  encodeFunctionData(functionFragment: 'current_guardian_set_index', values: []): Uint8Array;
  encodeFunctionData(functionFragment: 'current_wormhole_provider', values: []): Uint8Array;
  encodeFunctionData(functionFragment: 'governance_action_is_consumed', values: [string]): Uint8Array;
  encodeFunctionData(functionFragment: 'guardian_set', values: [BigNumberish]): Uint8Array;
  encodeFunctionData(functionFragment: 'submit_new_guardian_set', values: [Bytes]): Uint8Array;

  decodeFunctionData(functionFragment: 'owner', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'ema_price', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'ema_price_no_older_than', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'ema_price_unsafe', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'parse_price_feed_updates', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'price', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'price_no_older_than', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'price_unsafe', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'update_fee', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'update_price_feeds', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'update_price_feeds_if_necessary', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'valid_time_period', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'constructor', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'latest_publish_time', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'price_feed_exists', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'price_feed_unsafe', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'single_update_fee', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'valid_data_source', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'valid_data_sources', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'current_guardian_set_index', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'current_wormhole_provider', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'governance_action_is_consumed', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'guardian_set', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'submit_new_guardian_set', data: BytesLike): DecodedValue;
}

export class PythContractAbi extends Contract {
  interface: PythContractAbiInterface;
  functions: {
    owner: InvokeFunction<[], StateOutput>;
    ema_price: InvokeFunction<[price_feed_id: string], PriceOutput>;
    ema_price_no_older_than: InvokeFunction<[time_period: BigNumberish, price_feed_id: string], PriceOutput>;
    ema_price_unsafe: InvokeFunction<[price_feed_id: string], PriceOutput>;
    parse_price_feed_updates: InvokeFunction<[max_publish_time: BigNumberish, min_publish_time: BigNumberish, target_price_feed_ids: Vec<string>, update_data: Vec<Bytes>], Vec<PriceFeedOutput>>;
    price: InvokeFunction<[price_feed_id: string], PriceOutput>;
    price_no_older_than: InvokeFunction<[time_period: BigNumberish, price_feed_id: string], PriceOutput>;
    price_unsafe: InvokeFunction<[price_feed_id: string], PriceOutput>;
    update_fee: InvokeFunction<[update_data: Vec<Bytes>], BN>;
    update_price_feeds: InvokeFunction<[update_data: Vec<Bytes>], void>;
    update_price_feeds_if_necessary: InvokeFunction<[price_feed_ids: Vec<string>, publish_times: Vec<BigNumberish>, update_data: Vec<Bytes>], void>;
    valid_time_period: InvokeFunction<[], BN>;
    constructor: InvokeFunction<[data_sources: Vec<DataSourceInput>, single_update_fee: BigNumberish, valid_time_period_seconds: BigNumberish, wormhole_guardian_set_upgrade: Bytes], void>;
    latest_publish_time: InvokeFunction<[price_feed_id: string], BN>;
    price_feed_exists: InvokeFunction<[price_feed_id: string], boolean>;
    price_feed_unsafe: InvokeFunction<[price_feed_id: string], PriceFeedOutput>;
    single_update_fee: InvokeFunction<[], BN>;
    valid_data_source: InvokeFunction<[data_source: DataSourceInput], boolean>;
    valid_data_sources: InvokeFunction<[], Vec<DataSourceOutput>>;
    current_guardian_set_index: InvokeFunction<[], number>;
    current_wormhole_provider: InvokeFunction<[], WormholeProviderOutput>;
    governance_action_is_consumed: InvokeFunction<[governance_action_hash: string], boolean>;
    guardian_set: InvokeFunction<[index: BigNumberish], GuardianSetOutput>;
    submit_new_guardian_set: InvokeFunction<[encoded_vm: Bytes], void>;
  };
}
