import { Key } from "npm:node-bignumber";
import type { RSAKeyInfo } from "./rsaKey.ts";

class RSAPincodeVerifier {
	constructor(private message: string) {}

	getRSACrypto(json: RSAKeyInfo) {
		const message = this.message;
		const rsa = new Key();
		rsa.setPublic(json.nvalue, json.evalue);
		const credentials = rsa.encrypt(message).toString("hex");
		const keyname = json.keynm;
		return { keyname, credentials, message };
	}
}

export default RSAPincodeVerifier;