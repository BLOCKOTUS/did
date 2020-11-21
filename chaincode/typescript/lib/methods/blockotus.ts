import type { ParsedDIDUrl } from "../../../../types";

export const blockotus = async (parsedDidUrl: ParsedDIDUrl) => {
  console.log('BLOCKOTUS', JSON.stringify(parsedDidUrl));
}