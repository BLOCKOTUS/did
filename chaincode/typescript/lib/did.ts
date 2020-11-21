/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

import { Context, Contract } from 'fabric-contract-api';

import { blockotus } from './methods/blockotus';

import type {
    DIDUrl,
    ParsedDIDUrl,
} from '../../../types';

export class Did extends Contract {

    public async initLedger() {
        console.log('initLedger');
    }

    /**
     * Request a DID Url.
     * 
     * @param ctx Context
     * @arg didUrl
     */
    public async request (ctx: Context): Promise<any> {
        const args = ctx.stub.getFunctionAndParameters();
        const params = args.params;
        this.validateParams(params, 1);

        const didUrl = params[0];

        // here the fun begins, and we will parse the URL the other way - convert it to arguments
        // we prefer to achieve this onchain rather than offchain (api/js)
        // it makes the behaviour more reliable, predictable, and verifiable
        const parsedDidUrl = this.parseDidUrl(didUrl);

        // we invoke the method with parsedDidUrl
        const response = await this.requestWithMethod(ctx, parsedDidUrl);
        return response;
    }

    /**
     * Parse a DID url and return an object of information to interact with a decentralized entity.
     */
    private parseDidUrl = (didUrl: DIDUrl): ParsedDIDUrl => {
        const reFragment = /#[\w?\/:#]*/g;
        const reQuery = /\?.*/g; // remove fragment match before matching query
        const rePath = /\/(.)*/g; // remove query match before matching path

        const matchedFragment = didUrl.match(reFragment);
        const fragment = Array.isArray(matchedFragment) ? matchedFragment[0] : '';
        let didUrlCut = didUrl.replace(fragment, '');

        const matchedQuery = didUrlCut.match(reQuery);
        const rawQuery = Array.isArray(matchedQuery) ? matchedQuery[0] : '';
        const query = this.queryStringToObject(rawQuery);
        didUrlCut = didUrlCut.replace(rawQuery, '');

        const matchedPath = didUrlCut.match(rePath);
        const rawPath = Array.isArray(matchedPath) ? matchedPath[0] : '';
        let urlPath = rawPath.split('/');
        urlPath.shift();
        didUrlCut = didUrlCut.replace(rawPath, '');

        const methodInfo = didUrlCut.split(':');
        const methodName = methodInfo[1];

        return {
            methodName,
            methodSpecificId: methodInfo.slice(2).join(':'),
            urlPath,
            query,
            fragment,
        }
    }

    /**
     * Request a DID method, following W3C spec registries.
     * 
     * https://w3c.github.io/did-spec-registries/#did-methods
     */
    private requestWithMethod = async (ctx: Context, parsedDidUrl: ParsedDIDUrl): Promise<any> => {
        // implemented DID methods
        const allowedMethods = {
            blockotus,
            btcr: null,
            key: null,
        }

        // execute the DID method
        if (allowedMethods[parsedDidUrl.methodName]) { return await allowedMethods[parsedDidUrl.methodName](ctx, parsedDidUrl); }

        // throw an error if the requested method is not a function
        throw new Error('DID Url Method is not allowed.');
    }

    /**
     * Transform a Query String to a javasript object
     * https://stackoverflow.com/questions/8648892/how-to-convert-url-parameters-to-a-javascript-object
     */
    private queryStringToObject = (queryString: string): Record<string, any> => {
        const params = new URLSearchParams(queryString);
        const result = {};
        for(const [key, value] of params) { // each 'entry' is a [key, value] tupple
            result[key] = value;
        }
        return result;
    };

    /**
     * Validate the params received as arguments by a public functions.
     * Params are stored in the Context.
     *
     * @param {string[]} params params received by a pubic function
     * @param {number} count number of params expected
     */
    private validateParams = (params: string[], count: number): void => {
        if (params.length !== count) { throw new Error(`Incorrect number of arguments. Expecting ${count}. Args: ${JSON.stringify(params)}`); }
    }

    /**
     * Get the creatorId (transaction submitter unique id) from the Helper organ.
     */
    private getCreatorId = async (ctx: Context): Promise<string> => {
        const rawId = await ctx.stub.invokeChaincode('helper', ['getCreatorId'], 'mychannel');
        if (rawId.status !== 200) { throw new Error(rawId.message); }
        return rawId.payload.toString();
    }

    /**
     * Get the timestamp from the Helper organ.
     */
    private getTimestamp = async (ctx: Context): Promise<string> => {
        const rawTs = await ctx.stub.invokeChaincode('helper', ['getTimestamp'], 'mychannel');
        if (rawTs.status !== 200) { throw new Error(rawTs.message); }
        return rawTs.payload.toString();
    }
}
