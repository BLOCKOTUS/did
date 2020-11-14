import fs from 'fs';
import path from 'path';

import { getContractAndGateway } from '../../helper/api/index.minified.js';

const WALLET_PATH = path.join(__dirname, '..', '..', '..', 'wallet');