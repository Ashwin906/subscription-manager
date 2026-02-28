import {Client as workFlowClient} from '@upstash/workflow';

import { QSTASH_TOKEN, QSTASH_URL } from './env';

export const workFlowClient = new workFlowClient({
    baseUrl: QSTASH_URL,
    token: QSTASH_TOKEN,
})