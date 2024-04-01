import {OrderbookAbi} from "../sdk/blockchain/fuel/types/orderbook";

const isEvent = (eventName: string, object: any, abi: OrderbookAbi) => checkFieldsInObject(object, getEventFields(eventName, abi)!)
export default isEvent


export function getEventFields(eventName: string, factory: OrderbookAbi): string[] | undefined {
    const jsonAbiEventTypes = factory.interface.jsonAbi.types.find(jsonAbiType => jsonAbiType.type.includes(eventName));
    return jsonAbiEventTypes?.components?.map(({name}) => name)
}

export function checkFieldsInObject(obj: any, fields: string[]): boolean {
    return typeof obj === 'object' && fields.every(field => field in obj);
}
