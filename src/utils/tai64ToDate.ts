import { BN } from "@compolabs/spark-ts-sdk";

export default function tai64ToDate(num: string) {
  const dateStr = new BN((BigInt(num) - BigInt(Math.pow(2, 62)) - BigInt(10)).toString())
    .times(1000)
    .toString();
  return new Date(+dateStr);
}
