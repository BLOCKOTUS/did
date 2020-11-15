import fs from 'fs';
import path from 'path';

import { getContractAndGateway } from '../../helper/api/index.minified.js';

const WALLET_PATH = path.join(__dirname, '..', '..', '..', 'wallet');

/**
 * Transform a javascript object to a Query String
 * https://gist.github.com/tjmehta/9204891#gistcomment-3527084
 */
const objectToQueryString = (initialObj: Record<string, any>): string => {
  const reducer = (obj, parentPrefix = null) => (prev, key) => {
    const val = obj[key];
    key = encodeURIComponent(key);
    const prefix = parentPrefix ? `${parentPrefix}[${key}]` : key;

    if (val == null || typeof val === 'function') {
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
 * DID url constructor helpers.
 */
const makePath = (urlPath: string) => urlPath && urlPath.substr(0, 1) === '/' ? urlPath : '';
const makeQuery = (query: Record<string, any>) => query ? `?${objectToQueryString(query)}` : '';
const makeFragment = (fragment: string) => fragment ? `#${fragment}` : '';

/**
 * Construct a DID url based on arguments.
 * The DID url will be consumed by Chaincode Contracts.
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
  query?: Record<string, any>,
  fragment?: string,
}): string => `did:${methodName}:${methodSpecificId}${makePath(urlPath)}${makeQuery(query)}${makeFragment(fragment)}`;

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
}: {
  url?: string,
  methodName?: string,
  methodSpecificId?: string,
  urlPath?: string,
  query?: Record<string, any>,
  fragment?: string,
}): Promise<any> => {
  if (!url && (!methodName || !methodSpecificId)) throw new Error('Url or methodName and methodSpecificId are missing.');
  if (!url) url = makeUrl({ methodName, methodSpecificId, urlPath, query, fragment });
  console.log({url});
};
