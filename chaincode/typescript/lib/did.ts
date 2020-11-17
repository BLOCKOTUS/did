/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

import { Context, Contract } from 'fabric-contract-api';

import type {
    DIDUrl,
    ParsedDIDUrl,
} from '../../../types';

export class Did extends Contract {

    public initLedger = async () => {
        console.log('initLedger');
    }

    /**
     *
     * @param ctx Context
     * @arg url
     */
    public request = async (ctx: Context): Promise<string> => {
        const args = ctx.stub.getFunctionAndParameters();
        const params = args.params;
        this.validateParams(params, 1);

        const didUrl = params[0];

        // here the fun begins, and we will parse the URl the other way - convert it to arguments
        // we prefer to achieve this onchain rather than offchain (api/js)
        // it makes the behaviour more reliable, predictable, and verifiable
    }

    private parseDidUrl = (ur: DIDUrl): ParsedDIDUrl => {
        let reFragment = /#[\w?\/#]*/g;
        let reQuery = /\?.*/g; // remove fragment match before matching query
        let rePath = /\/(.)*/g; // remove query match before matching path
    }

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
