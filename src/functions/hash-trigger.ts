import { createHmac } from 'crypto';
import qs from 'qs';

const HASH_COMPARE = 'ABCDEF123456789ABCDEF123456789FF';

function signTrigger(data: object): string {
  if (typeof data === 'string') return createHmac('sha1', HASH_COMPARE).update(data).digest('hex');
  else return createHmac('sha1', HASH_COMPARE).update(qs.stringify(data)).digest('hex');
}

export { signTrigger };
