/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

import { Context, Contract } from 'fabric-contract-api';

export class Did extends Contract {

    public async initLedger() {
        console.log('initLedger');
    };

    /**
     * 
     * @param ctx Context
     * @arg url
     */
    public async request(ctx: Context): Promise<string> {
        const args = ctx.stub.getFunctionAndParameters();
        const params = args.params;
        this.validateParams(params, 1);

        const didUrl = params[0];

        // here the fun begins, and we will parse the URl the other way - convert it to arguments
        // we prefer to achieve this onchain rather than offchain (api/js)
        // it makes the behaviour more reliable, predictable, and verifiable
    };

    /**
     * Validate the params received as arguments by a public functions.
     * Params are stored in the Context.
     * 
     * @param {string[]} params params received by a pubic function
     * @param {number} count number of params expected
     */
    private validateParams(params: string[], count: number): void {
        if (params.length !== count) { throw new Error(`Incorrect number of arguments. Expecting ${count}. Args: ${JSON.stringify(params)}`); }
    }

    /**
     * Get the creatorId (transaction submitter unique id) from the Helper organ.
     */
    private async getCreatorId(ctx: Context): Promise<string> {
        const rawId = await ctx.stub.invokeChaincode('helper', ['getCreatorId'], 'mychannel');
        if (rawId.status !== 200) { throw new Error(rawId.message); }
        return rawId.payload.toString();
    }

    /**
     * Get the timestamp from the Helper organ.
     */
    private async getTimestamp(ctx: Context): Promise<string> {
        const rawTs = await ctx.stub.invokeChaincode('helper', ['getTimestamp'], 'mychannel');
        if (rawTs.status !== 200) { throw new Error(rawTs.message); }
        return rawTs.payload.toString();
    }
}
