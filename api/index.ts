import fs from 'fs';
import path from 'path';

import { getContractAndGateway } from '../../helper/api/index.minified.js';

const WALLET_PATH = path.join(__dirname, '..', '..', '..', 'wallet');

/**
 * Construct a DID url based on arguments.
 * The DID url will be consumed by Chaincode Contracts.
 * did-url = did path-abempty [ "?" query ] [ "#" fragment ]
 * path-abempty    ; begins with "/" or is empty
 */
const makeUrl = ({
  methodName,
  methodSpecificId,
  path,
  query,
  fragment,
}: {
  methodName: string,
  methodSpecificId: string,
  path?: string,
  query?: string,
  fragment?: string,
}): string => `did:${methodName}:${methodSpecificId}`;

/**
 * Make a request to the network, using a DID url.
 * The function accept a constructed DID url, or arguments necessary to its construction.
 */
export const request = async ({
  url,
  methodName,
  methodSpecificId,
  path,
  query,
  fragment,
}: {
  url?: string,
  methodName?: string,
  methodSpecificId?: string,
  path?: string,
  query?: string,
  fragment?: string,
}): Promise<any> => {
  if (!url && (!methodName || !methodSpecificId)) throw new Error('Url or methodName and methodSpecificId are missing.');
  if (!url) url = makeUrl({ methodName, methodSpecificId, query, fragment });
};
