/**
 * @module
 * LINE SelfBot Client
 */

import ThriftRenameParser from "./lib/thrift/parser.js";
import { Thrift } from "./lib/thrift/thrift.ts";
import { TypedEventEmitter } from "./lib/typed-event-emitter/index.ts";
import type { LoginOptions } from "./method/login.ts";
import { type Device, getDeviceDetails } from "./utils/device.ts";
import { InternalError } from "./utils/errors.ts";
import type { ClientEvents } from "./utils/events.ts";
import {
	AUTH_TOKEN_REGEX,
	EMAIL_REGEX,
	PASSWORD_REGEX,
} from "./utils/regex.ts";
import type { System } from "./utils/system.ts";
import type { User } from "./utils/user.ts";
import type { Metadata } from "./utils/metadata.ts";
import {
	type NestedArray,
	type ProtocolKey,
	Protocols,
} from "./lib/thrift/declares.ts";
import { writeThrift } from "./lib/thrift/write.js";
import { readThrift } from "./lib/thrift/read.js";
import type { RSAKeyInfo } from "./lib/rsa/rsaKey.ts";
import type { LooseType } from "./utils/common.ts";
import RSAPincodeVerifier from "./lib/rsa/rsaVerify.ts";
import * as fs from "node:fs/promises";

/**
 * @description LINE SelfBot Client
 */
export class Client extends TypedEventEmitter<ClientEvents> {
	constructor() {
		super();
		this.parser.def = Thrift;
	}

	public user: User<"me"> | undefined;
	public system: System | undefined;
	public metadata: Metadata | undefined;

	public async login(options: LoginOptions) {
		if (options.authToken) {
			if (!AUTH_TOKEN_REGEX.test(options.authToken)) {
				throw new InternalError(
					"Invalid auth token",
					`'${options.authToken}'`,
				);
			}
		} else if (options.email && options.password) {
			if (!EMAIL_REGEX.test(options.email)) {
				throw new InternalError("Invalid email", `'${options.email}'`);
			}

			if (!PASSWORD_REGEX.test(options.password)) {
				throw new InternalError(
					"Invalid password",
					`'${options.password}'`,
				);
			}
		} else {
			throw new InternalError(
				"Invalid login options",
				`Login options need 'authToken' or 'email' and 'password'`,
			);
		}

		const device = options.device || "IOSIPAD";
		const details = getDeviceDetails(device);

		if (!details) {
			throw new InternalError("Unsupported device", `'${device}'`);
		}

		this.system = {
			appVersion: details.appVersion,
			systemName: details.systemName,
			systemVersion: details.systemVersion,
			type:
				`${device}\t${details.appVersion}\t${details.systemName}\t${details.systemVersion}`,
			userAgent: `Line/${details.appVersion}`,
			device,
		};

		let authToken = options.authToken;

		if (!authToken) {
			if (!options.email || !options.password) {
				throw new InternalError(
					"Invalid login options",
					`Login options need 'authToken' or 'email' and 'password'`,
				);
			}

			authToken = await this.requestEmailLogin(
				options.email,
				options.password,
				false,
			);
		}

		this.metadata = {
			authToken,
		};

		this.emit("update:authtoken", authToken);
	}

	private parser: ThriftRenameParser = new ThriftRenameParser();
	private certPath: string | undefined;

	public registerCertPath(path: string) {
		this.certPath = path;
	}

	public async getCert() {
		let cert = "";

		if (this.certPath) {
			try {
				cert = await fs.readFile(this.certPath, "utf8");
			} catch (_) {
				return null;
			}
		} else {
			return null;
		}

		return cert;
	}

	public async requestEmailLogin(
		email: string,
		password: string,
		enableE2EE: boolean = false,
	): Promise<string> {
		if (!this.system) {
			throw new InternalError("Not setup yet", "Please call 'login()' first");
		}

		const rsaKey = await this.getRSAKeyInfo();

		const message = String.fromCharCode(rsaKey.sessionKey.length) +
			rsaKey.sessionKey +
			String.fromCharCode(email.length) +
			email +
			String.fromCharCode(password.length) +
			password;

		let e2eeData;
		if (enableE2EE) {
			e2eeData =
				"0\x8aEH\x96\xa7\x8d#5<\xfb\x91c\x12\x15\xbd\x13H\xfa\x04d\xcf\x96\xee1e\xa0]v,\x9f\xf2";
			throw new InternalError("Not supported login type", "'e2ee'");
		}

		const encryptedMessage =
			new RSAPincodeVerifier(message).getRSACrypto(rsaKey).credentials;

		const cert = await this.getCert() || undefined;

		const response = await this.requestLoginV2(
			rsaKey,
			encryptedMessage,
			this.system?.device,
			null,
			e2eeData,
			cert,
			"loginZ",
		);

		if (response[1]) {
			if (response[2]) {
				this.emit("update:cert", response[2]);
			}
			return response[1];
		} else {
			this.emit("pincall", response[4]);
			const headers = {
				"Host": "gw.line.naver.jp",
				"accept": "application/x-thrift",
				"user-agent": this.system.userAgent,
				"x-line-application": this.system.type,
				"x-line-access": response[3],
				"x-lal": "ja_JP",
				"x-lpv": "1",
				"x-lhm": "GET",
				"accept-encoding": "gzip",
			};
			const verifier = await fetch("https://gw.line.naver.jp/Q", {
				headers: headers,
			}).then((res) => res.json());
			const loginReponse = await this.requestLoginV2(
				rsaKey,
				encryptedMessage,
				this.system.device,
				verifier.result.verifier,
				e2eeData,
				undefined,
				"loginZ",
			);
			if (loginReponse[2]) {
				this.emit("update:cert", loginReponse[2]);
			}
			return loginReponse[1];
		}
	}

	private async requestLoginV2(
		rsaKey: RSAKeyInfo,
		encryptedMessage: LooseType,
		deviceName: Device,
		verifier: LooseType,
		secret: LooseType,
		cert: LooseType,
		calledName = "loginV2",
	) {
		let loginType = 2;
		if (!secret) loginType = 0;
		if (verifier) {
			loginType = 1;
		}
		return await this.direct_request(
			[
				[
					12,
					2,
					[
						[8, 1, loginType],
						[8, 2, 1],
						[11, 3, rsaKey.keynm],
						[11, 4, encryptedMessage],
						[2, 5, 0],
						[11, 6, ""],
						[11, 7, deviceName],
						[11, 8, cert],
						[11, 9, verifier],
						[11, 10, secret],
						[8, 11, 1],
						[11, 12, "System Product Name"],
					],
				],
			],
			calledName,
			3,
			true,
			"/api/v3p/rs",
		);
	}

	public async getRSAKeyInfo(provider = 0): Promise<RSAKeyInfo> {
		const RSAKeyInfo = await this.request(
			[
				[8, 2, provider],
			],
			"getRSAKeyInfo",
			3,
			true,
			"/api/v3/TalkService.do",
		);
		return {
			keynm: RSAKeyInfo[1],
			nvalue: RSAKeyInfo[2],
			evalue: RSAKeyInfo[3],
			sessionKey: RSAKeyInfo[4],
		};
	}

	public async request(
		value: NestedArray,
		name: string,
		protocol_type: ProtocolKey = 3,
		parse: boolean | string = true,
		path = "/S3",
		headers = {},
	): Promise<LooseType> {
		return (await this.rawRequest(
			path,
			[
				[
					12,
					1,
					value,
				],
			],
			name,
			protocol_type,
			headers,
			undefined,
			parse,
		)).value;
	}

	public async direct_request(
		value: NestedArray,
		name: string,
		protocol_type: ProtocolKey = 3,
		parse = true,
		path = "/S3",
		headers = {},
	) {
		return (await this.rawRequest(
			path,
			value,
			name,
			protocol_type,
			headers,
			undefined,
			parse,
		)).value;
	}

	public async rawRequest(
		path: string,
		value: NestedArray,
		name: string,
		protocol_type: ProtocolKey,
		append_headers = {},
		override_method = "POST",
		parse: boolean | string = true,
	) {
		if (!this.system || !this.metadata) {
			throw new InternalError(
				"Not setup yet",
				"Please call 'login()' first",
			);
		}

		const Protocol = Protocols[protocol_type];
		let headers = {
			"Host": "gw.line.naver.jp",
			"accept": "application/x-thrift",
			"user-agent": this.system.userAgent,
			"x-line-application": this.system.type,
			"x-line-access": this.metadata.authToken,
			"content-type": "application/x-thrift",
			"x-lal": "ja_JP",
			"x-lpv": "1",
			"x-lhm": "POST",
			"accept-encoding": "gzip",
		};

		headers = { ...headers, ...append_headers };
		let res;
		try {
			const Trequest = writeThrift(value, name, Protocol);
			const response = await fetch("https://gw.line.naver.jp" + path, {
				method: override_method,
				headers: headers,
				body: Trequest,
			});
			if (response.headers.get("x-line-next-access")) {
				this.metadata.authToken = response.headers.get("x-line-next-access") ||
					this.metadata.authToken;

				this.emit("update:authtoken", this.metadata.authToken);
			}

			const body = await response.arrayBuffer();
			const parsedBody = new Uint8Array(body);
			res = readThrift(parsedBody, Protocol);
			if (parse === true) {
				this.parser.rename_data(res);
			} else if (typeof parse === "string") {
				res.value = this.parser.rename_thrift(parse, res.value);
			}
		} catch (error) {
			throw new InternalError("Request external failed", String(error));
		}
		if (res && res.e) {
			throw new InternalError("Request internal failed", String(res.e));
		}
		return res;
	}
}