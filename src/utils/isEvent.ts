import { Contract } from "fuels";

const isEvent = (eventName: string, object: any, abi: Contract) =>
  checkFieldsInObject(object, getEventFields(eventName, abi)!);
export default isEvent;

export function getEventFields(eventName: string, factory: Contract): string[] | undefined {
  const jsonAbiEventTypes = factory.interface.jsonAbi.types.find(
    (jsonAbiType) => jsonAbiType.type === `struct ${eventName}`
  );
  return jsonAbiEventTypes?.components?.map(({ name }) => name);
}

export function checkFieldsInObject(obj: any, fields: string[]): boolean {
  return typeof obj === "object" && fields.every((field) => field in obj);
}
