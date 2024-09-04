// For Base (login, request, line, relation, etc)

import * as fs from "node:fs/promises";
import { getRSACrypto } from "../libs/rsa/rsa-verify.ts";
import type { BaseStorage } from "../libs/storage/base-storage.ts";
import { MemoryStorage } from "../libs/storage/memory-storage.ts";
import {
	type NestedArray,
	type ParsedThrift,
	type ProtocolKey,
	Protocols,
} from "../libs/thrift/declares.ts";
import type * as LINETypes from "../libs/thrift/line_types.ts";
import ThriftRenameParser from "../libs/thrift/parser.js";
import { readThrift } from "../libs/thrift/read.js";
import { Thrift } from "../libs/thrift/thrift.ts";
import { writeThrift } from "../libs/thrift/write.js";
import { TypedEventEmitter } from "../libs/typed-event-emitter/index.ts";
import type { LogType } from "../entities/log.ts";
import type { LoginOptions } from "../entities/login.ts";
import type { LooseType } from "../entities/common.ts";
import { type Device, getDeviceDetails } from "../entities/device.ts";
import { InternalError } from "../entities/errors.ts";
import type { ClientEvents } from "../entities/events.ts";
import type { Metadata } from "../entities/metadata.ts";
import {
	AUTH_TOKEN_REGEX,
	EMAIL_REGEX,
	PASSWORD_REGEX,
	PRIMARY_TOKEN_REGEX,
} from "../entities/regex.ts";
import type { System } from "../entities/system.ts";
import type { User } from "../entities/user.ts";
import { Buffer } from "node:buffer";

interface ClientOptions {
	storage?: BaseStorage;
	endpoint?: string;
}

export class BaseClient extends TypedEventEmitter<ClientEvents> {
	/**
	 * @description Create a new LINE SelfBot Client instance
	 *
	 * @param {ClientOptions} [options] Options for the client
	 * @param {BaseStorage} [options.storage] Storage for the client
	 * @param {string} [options.endpoint] Endpoint for the client
	 */
	constructor(options: ClientOptions = {}) {
		super();
		this.parser.def = Thrift;
		const requiredOptions = {
			storage: new MemoryStorage(),
			endpoint: "gw.line.naver.jp",
			...options,
		};

		this.storage = requiredOptions.storage;
		this.endpoint = requiredOptions.endpoint;
	}

	public storage: BaseStorage;
	public endpoint: string;

	/**
	 * @description THe information of user
	 */
	public user: User<"me"> | undefined;
	/**
	 * @description The information of system
	 */
	public system: System | undefined;
	/**
	 * @description The information of metadata
	 */
	public metadata: Metadata | undefined;

	/**
	 * @description Emit log event
	 *
	 * @param {LooseType} [data] Log data
	 * @emits log
	 */
	public log(type: LogType, data: LooseType) {
		this.emit("log", {
			type,
			data,
		});
	}

	/**
	 * @description Login to LINE server with auth token or email/password
	 *
	 * @param {LoginOptions} [options] Options for login
	 * @throws {InternalError} If login options are invalid
	 * @throws {InternalError} If email is invalid
	 * @throws {InternalError} If password is invalid
	 * @throws {InternalError} If device is unsupported
	 * @throws {InternalError} If auth token is invalid
	 * @emits ready
	 * @emits update:authtoken
	 */
	public async login(options: LoginOptions): Promise<void> {
		if (options.authToken) {
			if (!AUTH_TOKEN_REGEX.test(options.authToken)) {
				throw new InternalError("Invalid auth token", `'${options.authToken}'`);
			}
		} else if (options.email && options.password) {
			if (!EMAIL_REGEX.test(options.email)) {
				throw new InternalError("Invalid email", `'${options.email}'`);
			}

			if (!PASSWORD_REGEX.test(options.password)) {
				throw new InternalError("Invalid password", `'${options.password}'`);
			}
		} else {
			throw new InternalError(
				"Invalid login options",
				`Login options need 'authToken' or 'email' and 'password'`,
			);
		}

		const device: Device =
			options.device ||
			(options.authToken
				? PRIMARY_TOKEN_REGEX.test(options.authToken)
					? "ANDROID"
					: "IOSIPAD"
				: "IOSIPAD");
		const details = getDeviceDetails(device);

		if (!details) {
			throw new InternalError("Unsupported device", `'${device}'`);
		}

		this.system = {
			appVersion: details.appVersion,
			systemName: details.systemName,
			systemVersion: details.systemVersion,
			type: `${device}\t${details.appVersion}\t${details.systemName}\t${details.systemVersion}`,
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
				options.e2ee,
			);
		}

		this.metadata = {
			authToken,
		};

		const profile = await this.getProfile();

		this.emit("update:authtoken", authToken);

		this.user = {
			type: "me",
			...profile,
		};

		this.emit("ready", this.user);
	}

	protected parser: ThriftRenameParser = new ThriftRenameParser();
	private cert: string | null = null;

	/**
	 * @description Registers a certificate path to be used for login.
	 *
	 * @param {string} [path]  - The path to the certificate.
	 */
	public async registerCertPath(path: string): Promise<void> {
		let cert;

		try {
			cert = await fs.readFile(path, "utf8");
		} catch (_) {
			cert = null;
		}

		this.registerCert(cert);
	}

	/**
	 * @description Registers a certificate to be used for login.
	 *
	 * @param {string | null} cert - The certificate to register. If null, the certificate will be cleared.
	 */
	public registerCert(cert: string | null): void {
		this.cert = cert;
	}

	/**
	 * @description Reads the certificate from the registered path, if it exists.
	 *
	 * @return {Promise<string | null>} The certificate, or null if it does not exist or an error occurred.
	 */
	public getCert(): string | null {
		return this.cert;
	}

	/**
	 * @description Login to LINE server with email and password.
	 *
	 * @param {string} [email] The email to login with.
	 * @param {string} [password] The password to login with.
	 * @param {boolean} [enableE2EE=false] Enable E2EE or not.
	 * @returns {Promise<string>} The auth token.
	 * @throws {InternalError} If the system is not setup yet.
	 * @throws {InternalError} If the login type is not supported.
	 * @emits pincall
	 * @emits update:cert
	 */
	public async requestEmailLogin(
		email: string,
		password: string,
		enableE2EE: boolean = false,
	): Promise<string> {
		this.log("login", {
			method: "email",
			email,
			password,
		});
		if (!this.system) {
			throw new InternalError("Not setup yet", "Please call 'login()' first");
		}

		const rsaKey = await this.getRSAKeyInfo();
		const { keynm, sessionKey } = rsaKey;

		const message =
			String.fromCharCode(sessionKey.length) +
			sessionKey +
			String.fromCharCode(email.length) +
			email +
			String.fromCharCode(password.length) +
			password;

		let e2eeData: Buffer | undefined, secret: Uint8Array | undefined, secretPK: string | undefined;
		
		const constantPincode = "202202";
		if (enableE2EE) {
			[secret, secretPK] = this.createSqrSecret(true);
			e2eeData = this._encryptAESECB(
				this.getSHA256Sum(constantPincode),
				Buffer.from(secretPK, "base64"),
			);
		}

		const encryptedMessage = getRSACrypto(message, rsaKey).credentials;

		const cert = this.getCert() || undefined;

		let response = await this.loginV2(
			keynm,
			encryptedMessage,
			this.system?.device,
			undefined,
			e2eeData,
			cert,
			"loginZ",
		);

		if (!response.authToken) {
			this.emit("pincall", response.pinCode || constantPincode);
			if (enableE2EE && secret) {
				const headers = {
					Host: this.endpoint,
					accept: "application/x-thrift",
					"user-agent": this.system.userAgent,
					"x-line-application": this.system.type,
					"x-line-access": response.verifier,
					"x-lal": "ja_JP",
					"x-lpv": "1",
					"x-lhm": "GET",
					"accept-encoding": "gzip",
				};
				const e2eeInfo = (
					await fetch(`https://${this.endpoint}/LF1`, {
						headers: headers,
					}).then((res) => res.json())
				).result;
				this.log("response", e2eeInfo);
				this.decodeE2EEKeyV1(e2eeInfo.metadata, Buffer.from(secret));
				const deviceSecret = this.encryptDeviceSecret(
					Buffer.from(e2eeInfo.publicKey, "base64"),
					Buffer.from(secret),
					e2eeInfo.encryptedKeyChain,
				);
				const e2eeLogin = await this.confirmE2EELogin(
					response.verifier,
					deviceSecret,
				);
				response = await this.loginV2(
					keynm,
					encryptedMessage,
					this.system.device,
					e2eeLogin,
					e2eeData,
					cert,
					"loginZ",
				);
			} else {
				const headers = {
					Host: this.endpoint,
					accept: "application/x-thrift",
					"user-agent": this.system.userAgent,
					"x-line-application": this.system.type,
					"x-line-access": response.verifier,
					"x-lal": "ja_JP",
					"x-lpv": "1",
					"x-lhm": "GET",
					"accept-encoding": "gzip",
				};
				const verifier = await fetch(`https://${this.endpoint}/Q`, {
					headers: headers,
				}).then((res) => res.json());
				this.log("response", verifier);
				response = await this.loginV2(
					keynm,
					encryptedMessage,
					this.system.device,
					verifier.result.verifier,
					e2eeData,
					cert,
					"loginZ",
				);
			}
		}
		if (response.certificate) {
			this.emit("update:cert", response.certificate);
		}
		return response.authToken;
	}

	public createSqrSecret(_base64Only: boolean): [Uint8Array, string] {
		return [new Uint8Array(), ""];
	}
	public getSHA256Sum(..._args: string[] | Buffer[]) {
		return Buffer.from([]);
	}
	public _encryptAESECB(_aesKey: LooseType, _plainData: LooseType) {
		return Buffer.from([]);
	}
	public decodeE2EEKeyV1(_data: LooseType, _secret: Buffer): LooseType {}

	public encryptDeviceSecret(
		_publicKey: Buffer,
		_privateKey: Buffer,
		_encryptedKeyChain: Buffer,
	) {
		return Buffer.from([]);
	}

	public confirmE2EELogin(verifier: string, deviceSecret: Buffer) {
		return this.direct_request(
			[
				[11, 1, verifier],
				[11, 2, deviceSecret],
			],
			"confirmE2EELogin",
			3,
			false,
			"/api/v3p/rs",
		);
	}
	private async loginV2(
		keynm: string,
		encryptedMessage: string,
		deviceName: Device,
		verifier: string | undefined,
		secret: Buffer | undefined,
		cert: string | undefined,
		methodName: string = "loginV2",
	): Promise<LINETypes.LoginResult> {
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
						[11, 3, keynm],
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
			methodName,
			3,
			"LoginResult",
			"/api/v3p/rs",
		);
	}

	/**
	 * @description Get RSA key info for login.
	 *
	 * @param {number} [provider=0] Provider to get RSA key info from.
	 * @returns {Promise<LINETypes.RSAKey>} RSA key info.
	 * @throws {FetchError} If failed to fetch RSA key info.
	 */
	public async getRSAKeyInfo(provider: number = 0): Promise<LINETypes.RSAKey> {
		return await this.request(
			[[8, 2, provider]],
			"getRSAKeyInfo",
			3,
			"RSAKey",
			"/api/v3/TalkService.do",
		);
	}

	/**
	 * @description Request to LINE API.
	 *
	 * @param {NestedArray} [value] - The value to request.
	 * @param {string} [methodName] - The method name of the request.
	 * @param {ProtocolKey} [protocolType=3] - The protocol type of the request.
	 * @param {boolean | string} [parse=true] - Whether to parse the response.
	 * @param {string} [path="/S3"] - The path of the request.
	 * @param {object} [headers={}] - The headers of the request.
	 * @returns {Promise<LooseType>} The response.
	 */
	public async request(
		value: NestedArray,
		methodName: string,
		protocolType: ProtocolKey = 3,
		parse: boolean | string = true,
		path: string = "/S3",
		headers: Record<string, string | undefined> = {},
	): Promise<LooseType> {
		return (
			await this.rawRequest(
				path,
				[[12, 1, value]],
				methodName,
				protocolType,
				headers,
				undefined,
				parse,
			)
		).value;
	}

	/**
	 * @description Request to LINE API directly.
	 *
	 * @param {NestedArray} [value] - The value to request.
	 * @param {string} [methodName] - The method name of the request.
	 * @param {ProtocolKey} [protocolType=3] - The protocol type of the request.
	 * @param {boolean | string} [parse=true] - Whether to parse the response.
	 * @param {string} [path="/S3"] - The path of the request.
	 * @param {object} [headers={}] - The headers of the request.
	 * @returns {Promise<LooseType>} The response.
	 */
	public async direct_request(
		value: NestedArray,
		methodName: string,
		protocolType: ProtocolKey = 3,
		parse: boolean | string = true,
		path: string = "/S3",
		headers: Record<string, string | undefined> = {},
	): Promise<LooseType> {
		return (
			await this.rawRequest(
				path,
				value,
				methodName,
				protocolType,
				headers,
				undefined,
				parse,
			)
		).value;
	}

	public EXCEPTION_TYPES = {
		"/S3": "TalkException",
		"/S4": "TalkException",
		"/SYNC4": "TalkException",
		"/SYNC3": "TalkException",
		"/CH3": "ChannelException",
		"/CH4": "ChannelException",
		"/SQ1": "SquareException",
		"/LIFF1": "LiffException",
		"/api/v3p/rs": "TalkException",
		"/api/v3/TalkService.do": "TalkException",
	} as Record<string, string | undefined>;

	/**
	 * @description Request to LINE API by raw.
	 *
	 * @param {string} [path] - The path of the request.
	 * @param {NestedArray} [value] - The value to request.
	 * @param {string} [methodName] - The method name of the request.
	 * @param {ProtocolKey} [protocolType] - The protocol type of the request.
	 * @param {object} [appendHeaders={}] - The headers to append to the request.
	 * @param {string} [overrideMethod="POST"] - The method of the request.
	 * @param {boolean | string} [parse=true] - Whether to parse the response.
	 * @param {boolean} [isReRequest=false] - Is Re-Request.
	 * @returns {Promise<ParsedThrift>} The response.
	 *
	 * @throws {InternalError} If the request fails.
	 */
	public async rawRequest(
		path: string,
		value: NestedArray,
		methodName: string,
		protocolType: ProtocolKey,
		appendHeaders = {},
		overrideMethod = "POST",
		parse: boolean | string = true,
		isReRequest: boolean = false,
	): Promise<ParsedThrift> {
		if (!this.system) {
			throw new InternalError("Not setup yet", "Please call 'login()' first");
		}

		const Protocol = Protocols[protocolType];
		let headers = this.getHeader(this.metadata?.authToken, overrideMethod);

		headers = { ...headers, ...appendHeaders };

		const Trequest = writeThrift(value, methodName, Protocol);

		this.log("request", {
			method: "thrift",
			thriftMethodName: methodName,
			httpMethod: overrideMethod,
			protocolType,
			value,
			requestPath: path,
			data: Trequest,
			headers,
		});

		const response = await fetch(`https://${this.endpoint}${path}`, {
			method: overrideMethod,
			headers,
			body: Trequest,
		});
		const nextToken = response.headers.get("x-line-next-access");

		if (nextToken) {
			this.metadata = {
				authToken: nextToken,
			};

			this.emit("update:authtoken", this.metadata.authToken);
		}
		const body = await response.arrayBuffer();
		const parsedBody = new Uint8Array(body);

		const res = readThrift(parsedBody, Protocol);
		if (parse === true) {
			this.parser.rename_data(res);
		} else if (typeof parse === "string") {
			res.value = this.parser.rename_thrift(parse, res.value);
		}

		if (res.e) {
			const structName = this.EXCEPTION_TYPES[path] || "TalkException";

			if (structName) {
				res.e = this.parser.rename_thrift(structName, res.e);
			}
		}

		this.log("response", {
			method: "thrift",
			response,
			data: parsedBody,
			parsedData: res,
		});

		const isRefresh =
			res.e && res.e["code"] === "NOT_AUTHORIZED_DEVICE" && nextToken;

		if (res.e && !isRefresh) {
			throw new InternalError(
				"Request internal failed",
				JSON.stringify(res.e),
				res.e,
			);
		}

		if (isRefresh && !isReRequest) {
			return await this.rawRequest(
				path,
				value,
				methodName,
				protocolType,
				appendHeaders,
				overrideMethod,
				parse,
				true,
			);
		}
		return res;
	}

	/**
	 * Get HTTP headers for a request.
	 * @param {string | undefined} [lineAccessToken] The auth token to use in the `x-line-access` header.
	 * @param {string} [overrideMethod="POST"] The HTTP method to use in the `x-lhm` header.
	 * @returns {Record<string, string>} An object with the headers as key-value pairs.
	 * @throws {InternalError} If the client has not been setup yet.
	 */
	public getHeader(
		lineAccessToken: string | undefined,
		overrideMethod = "POST",
	): Record<string, string> {
		if (!this.system) {
			throw new InternalError("Not setup yet", "Please call 'login()' first");
		}

		const header = {
			Host: this.endpoint,
			accept: "application/x-thrift",
			"user-agent": this.system.userAgent,
			"x-line-application": this.system.type,
			"content-type": "application/x-thrift",
			"x-lal": "ja_JP",
			"x-lpv": "1",
			"x-lhm": overrideMethod,
			"accept-encoding": "gzip",
		} as Record<string, string>;

		if (lineAccessToken) {
			header["x-line-access"] = lineAccessToken;
		}

		return header;
	}

	/**
	 * @description Gets arugments of thrift
	 * @experimental
	 */
	public getArgumentsHelper(structName: string): LooseType[][] {
		return this.parser.get_cl(structName);
	}

	private LINEService_API_PATH = "/S4";
	private LINEService_PROTOCOL_TYPE: ProtocolKey = 4;

	private RelationService_API_PATH = "/RE4";
	private RelationService_PROTOCOL_TYPE: ProtocolKey = 4;

	/**
	 * @description Gets the profile of the current user.
	 */
	public async getProfile(): Promise<LINETypes.Profile> {
		return await this.request(
			[],
			"getProfile",
			this.LINEService_PROTOCOL_TYPE,
			"Profile",
			this.LINEService_API_PATH,
		);
	}
}
