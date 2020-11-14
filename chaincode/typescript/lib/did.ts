/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

import { Context, Contract } from 'fabric-contract-api';

export class Did extends Contract {

    public async initLedger() {
      console.log('initLedger');
    }

}
