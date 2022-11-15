import { createHmac } from "crypto";
import { equals } from "ramda";
import qs from "qs";

const HASH_COMPARE = "ABCDEF123456789ABCDEF123456789FF";

function signTrigger(data: object): string {
  if (typeof data === "string")
    return createHmac("sha1", HASH_COMPARE).update(data).digest("hex");
  else
    return createHmac("sha1", HASH_COMPARE)
      .update(qs.stringify(data))
      .digest("hex");
}

function isValidTrigger(data: object, signature: string): boolean {
  return equals(signature, this.sign(data));
}

export { signTrigger, isValidTrigger };
