import fs from 'fs';
import path from 'path';

import { getContractAndGateway } from '../../../helper/api/dist/index.js';
import type {
  DIDUrl,
} from '../../types';

const WALLET_PATH = path.join(__dirname, '..', '..', '..', '..', 'wallet');

/**
 * Transform a javascript object to a Query String
 * https://gist.github.com/tjmehta/9204891#gistcomment-3527084
 */
const objectToQueryString = (initialObj: Record<string, any>): string => {
  const reducer = (obj, parentPrefix = null) => (prev, key) => {
    const val = obj[key];
    key = encodeURIComponent(key);
    const prefix = parentPrefix ? `${parentPrefix}[${key}]` : key;

    if (val === null || typeof val === 'function') {
      prev.push(`${prefix}=`);
      return prev;
    }

    if (['number', 'boolean', 'string'].includes(typeof val)) {
      prev.push(`${prefix}=${encodeURIComponent(val)}`);
      return prev;
    }

    prev.push(Object.keys(val).reduce(reducer(val, prefix), []).join('&'));
    return prev;
  };

  return Object.keys(initialObj).reduce(reducer(initialObj), []).join('&');
};

/**
 * Transform a Query String to a javasript object
 * https://stackoverflow.com/questions/8648892/how-to-convert-url-parameters-to-a-javascript-object
 */
const queryStringToObject = (queryString: string): Record<string, any> => {
  const params = new URLSearchParams(queryString);
  const result = {};
  for (const [key, value] of params) { // each 'entry' is a [key, value] tupple
    result[key] = value;
  }
  return result;
};

/**
 * DID url constructor helpers.
 */
const makePath = (urlPath: string) => urlPath && urlPath.substr(0, 1) === '/' ? urlPath : '';
const makeQuery = (query: string) => query ? `?${objectToQueryString(JSON.parse(query))}` : '';
const makeFragment = (fragment: string) => fragment ? `#${fragment}` : '';

/**
 * Construct a DID url based on arguments.
 * The DID url will be consumed by Chaincode Contracts.
 *
 * https://www.w3.org/TR/did-core/#did-syntax
 * did-url = did path-abempty [ "?" query ] [ "#" fragment ]
 * path-abempty    ; begins with "/" or is empty
 */
const makeUrl = ({
  methodName,
  methodSpecificId,
  urlPath,
  query,
  fragment,
}: {
  methodName: string,
  methodSpecificId: string,
  urlPath?: string,
  query?: string,
  fragment?: string,
}): DIDUrl =>
  `did:${methodName}:${methodSpecificId}${makePath(urlPath)}${makeQuery(query)}${makeFragment(fragment)}`;

/**
 * Make a request to the network, using a DID url.
 * The function accept a constructed DID url, or arguments necessary to its construction.
 */
export const request = async ({
  url,
  methodName,
  methodSpecificId,
  urlPath,
  query,
  fragment,
  user,
}: {
  url?: DIDUrl,
  methodName?: string,
  methodSpecificId?: string,
  urlPath?: string,
  query?: string,
  fragment?: string,
  user: { username: string, wallet: string },
}): Promise<any> => {
  // check and construct didUrl
  if (!url && (!methodName || !methodSpecificId)) { throw new Error('Url or methodName and methodSpecificId are missing.'); }
  if (!url) { url = makeUrl({ methodName, methodSpecificId, urlPath, query, fragment }); }
  console.log({url});

  // create wallet
  const walletPath = path.join(WALLET_PATH, `${user.username}.id`);
  fs.writeFileSync(walletPath, JSON.stringify(user.wallet));

  // get contract and gateway
  const {contract, gateway} = await getContractAndGateway({username: user.username, chaincode: 'did', contract: 'Did'});
  if (!contract || !gateway) { throw new Error('Contract or Gateway missing.'); }

  // submit transaction
  const rawResponse = await contract.submitTransaction('request', url);

  // disconnect
  await gateway.disconnect();

  if (!rawResponse) { throw new Error('Error while submitting transaction.'); }

  const response = JSON.parse(rawResponse.toString('utf8'));
  return response;
};
