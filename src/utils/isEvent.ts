import {Contract} from "fuels";

const isEvent = (eventName: string, object: any, abi: Contract) => {
    const fields = getEventFields(eventName, abi);
    if (fields != null) {
        return checkFieldsInObject(object, fields)
    } else {
        return false
    }
}
export default isEvent


export function getEventFields(eventName: string, factory: Contract): string[] | undefined {
    const jsonAbiEventTypes = factory.interface.jsonAbi.types.find(jsonAbiType => jsonAbiType.type === `struct ${eventName}`);
    return jsonAbiEventTypes?.components?.map(({name}) => name)
}

export function checkFieldsInObject(obj: any, fields: string[]): boolean {
    return typeof obj === 'object' && fields.every(field => field in obj);
}
