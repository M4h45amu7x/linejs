/**
 * @module
 * Utility for LINE Scheme URI
 */

import type { ALL_STRING, WEB_SCHEME_PREFIX } from "../common/types.ts";

type LINE_SCHEME_PREFIX =
	| "line://"
	| WEB_SCHEME_PREFIX<"line.me/R/">
	| WEB_SCHEME_PREFIX<"line.naver.jp/R/">
	| ALL_STRING;

/**
 * @classdesc LINE Scheme Utility
 * @constructor
 */
class LINE_SCHEME_BASE {
	/**
	 * Create a new LINE Scheme instance, with prefix.
	 *
	 * @param {LINE_SCHEME_PREFIX} [prefix="line://"] the prefix of line scheme uri
	 */
	constructor(public prefix: LINE_SCHEME_PREFIX = "line://") {}

	/**
	 * Returns the URL for the home page
	 *
	 * @return {string} The URL for the home page
	 */
	public getHome(): string {
		return `${this.prefix}home`;
	}

	/**
	 * Returns a profile URL based on the provided prefix and whether to use NaverSticker
	 *
	 * @param {boolean} [useNv=true] - Whether to use Nv.
	 * @return {string} The profile URLSticker
	 */
	public getProfile(useNv = true): string {
		if (useNv) {
			return `${this.prefix}nv/profile`;
		}
		return `${this.prefix}profile`;
	}

	/**
	 * Returns the URL for the nv page
	 *
	 * @param {string} [nv] - nv path
	 * @return {string} The URL for the nv page
	 */
	public getNv(nv = ""): string {
		return `${this.prefix}nv${nv}`;
	}

	/**
	 * Returns the URL for the friend page
	 *
	 * @return {string} The URL for the friend page
	 */
	public getFriend(): string {
		return `${this.prefix}nv/friend`;
	}

	/**
	 * Returns the URL for the chat page
	 *
	 * @return {string} The URL for the chat page
	 */
	public getChat(): string {
		return `${this.prefix}nv/chat`;
	}

	/**
	 * Returns the URL for the timeline page
	 *
	 * @return {string} The URL for the timeline page
	 */
	public getTimeline(): string {
		return `${this.prefix}nv/timeline`;
	}

	/**
	 * Returns the URL for the voom page
	 *
	 * @returns {string} The URL for the voom page
	 */
	public getVoom(): string {
		return `${this.prefix}nv/timeline`;
	}

	/**
	 * Returns the URL for the news page
	 *
	 * @returns {string} The URL for the news page
	 */
	public getNews(): string {
		return `${this.prefix}nv/news`;
	}

	/**
	 * Returns the URL for the wallet page
	 *
	 * @returns {string} The URL for the wallet page
	 */
	public getWallet(): string {
		return `${this.prefix}nv/wallet`;
	}

	/**
	 * Returns the URL for the call page
	 *
	 * @returns {string} The URL for the call page
	 */
	public getCall(): string {
		return `${this.prefix}nv/call`;
	}

	/**
	 * Returns the URL for the settings page
	 *
	 * @returns {string} The URL for the settings page
	 */
	public getSettings(): string {
		return `${this.prefix}nv/settings`;
	}

	/**
	 * Returns the URL for the add friend page
	 *
	 * @return {string} The URL for the add friend page
	 */
	public getAddFriends(): string {
		return `${this.prefix}nv/addFriends`;
	}

	/**
	 * Returns the URL for the invite email page
	 *
	 * @returns {string} The URL for the invite email page
	 */
	public getInvitationEmail(): string {
		return `${this.prefix}nv/invitationEmail`;
	}

	/**
	 * Returns the URL for the invite sms page
	 *
	 * @returns {string} The URL for the invite sms page
	 */
	public getInvitationSms(): string {
		return `${this.prefix}nv/invitationSms`;
	}

	/**
	 * Returns the URL for the qr reader page
	 *
	 * @returns {string} The URL for the qr reader page
	 */
	public getQRCodeReader(): string {
		return `${this.prefix}nv/QRCodeReader`;
	}

	/**
	 * Returns the URL for the qr code page
	 *
	 * @returns {string} The URL for the qr code page
	 */
	public getQRCode(): string {
		return `${this.prefix}nv/QRCode`;
	}

	/**
	 * Returns the URL for the keep page
	 *
	 * @returns {string} The URL for the keep page
	 */
	public getKeep(): string {
		return `${this.prefix}nv/keep`;
	}

	/**
	 * Returns the URL for the set id page
	 *
	 * @returns {string} The URL for the set id page
	 */
	public getProfileSetId(): string {
		return `${this.prefix}nv/profileSetId`;
	}

	/**
	 * Returns the URL for the connect app page
	 *
	 * @returns {string} The URL for the connect app page
	 */
	public getConnectedApps(): string {
		return `${this.prefix}nv/connectedApps`;
	}

	/**
	 * Returns the URL for the connected app page
	 *
	 * @returns {string} The URL for the connected app page
	 */
	public getConnectedDevices(): string {
		return `${this.prefix}nv/connectedDevices`;
	}

	/**
	 * Returns the URL for the theme settings menu page
	 *
	 * @returns {string} The URL for the theme settings menu page
	 */
	public getThemeSettingsMenu(): string {
		return `${this.prefix}nv/themeSettingsMenu`;
	}

	/**
	 * Returns the URL for the coin settings page
	 *
	 * @returns {string} The URL for the coin settings page
	 */
	public getCoinsSettings(): string {
		return `${this.prefix}nv/coinsSettings`;
	}

	/**
	 * Returns the URL for the notification settings page
	 *
	 * @returns {string} The URL for the notification settings page
	 */
	public getNotificationSettings(): string {
		return `${this.prefix}nv/notificationSettings`;
	}

	/**
	 * Returns the URL for the notification service detail page
	 *
	 * @returns {string} The URL for the notification service detail page
	 */
	public getNotificationServiceDetail(): string {
		return `${this.prefix}nv/notificationServiceDetail`;
	}

	/**
	 * Returns the URL for the image/video settings page
	 *
	 * @returns {string} The URL for the image/video settings page
	 */
	public getImageVideoSettings(): string {
		return `${this.prefix}nv/imageVideoSettings`;
	}

	/**
	 * Returns the URL for the suggest settings page
	 *
	 * @returns {string} The URL for the suggest settings page
	 */
	public getSuggestSettings(): string {
		return `${this.prefix}nv/suggestSettings`;
	}

	/**
	 * Returns the URL for the notification page
	 *
	 * @returns {string} The URL for the notification page
	 */
	public getNotifications(): string {
		return `${this.prefix}nv/notifications`;
	}

	/**
	 * Returns the URL for the help page
	 *
	 * @returns {string} The URL for the help page
	 */
	public getHelp(): string {
		return `${this.prefix}nv/help`;
	}

	/**
	 * Returns the URL for the about page
	 *
	 * @returns {string} The URL for the about page
	 */
	public getAbout(): string {
		return `${this.prefix}nv/about`;
	}

	/**
	 * Returns the URL for the official account page
	 *
	 * @returns {string} The URL for the official account page
	 */
	public getOfficialAccounts(): string {
		return `${this.prefix}nv/officialAccounts`;
	}

	/**
	 * Returns the URL for the camera page
	 *
	 * @returns {string} The URL for the camera page
	 */
	public getCamera(): string {
		return `${this.prefix}nv/camera`;
	}

	/**
	 * Returns the URL for the location page
	 *
	 * @returns {string} The URL for the location page
	 */
	public getLocation(): string {
		return `${this.prefix}nv/location`;
	}

	/**
	 * Returns the URL for the multi camera page
	 *
	 * @returns {string} The URL for the multi camera page
	 */
	public getCameraRollMulti(): string {
		return `${this.prefix}nv/cameraRoll/multi`;
	}

	/**
	 * Returns the URL for the single camera page
	 *
	 * @returns {string} The URL for the single camera page
	 */
	public getCameraRollSingle(): string {
		return `${this.prefix}nv/cameraRoll/single`;
	}

	/**
	 * Returns the URL for the call settings page
	 *
	 * @returns {string} The URL for the call settings page
	 */
	public getCallSettings(): string {
		return `${this.prefix}nv/settings/callSettings`;
	}

	/**
	 * Returns the URL for the ringbacktone settings page
	 *
	 * @returns {string} The URL for the ringbacktone settings page
	 */
	public getRingbacktoneSettings(): string {
		return `${this.prefix}nv/settings/ringbacktone`;
	}

	/**
	 * Returns the URL for the ringtone settings page
	 *
	 * @returns {string} The URL for the ringtone settings page
	 */
	public getRingtoneSettings(): string {
		return `${this.prefix}nv/settings/ringtone`;
	}

	/**
	 * Returns the URL for the theme settings page
	 *
	 * @returns {string} The URL for the theme settings page
	 */
	public getThemeSettings(): string {
		return `${this.prefix}nv/settings/themeSettings`;
	}

	/**
	 * Returns the URL for the privacy settings page
	 *
	 * @returns {string} The URL for the privacy settings page
	 */
	public getPrivacySettings(useSettings = true): string {
		if (useSettings) {
			return `${this.prefix}nv/settings/privacy`;
		}
		return `${this.prefix}nv/privacy`;
	}

	/**
	 * Returns the URL for the account settings page
	 *
	 * @returns {string} The URL for the account settings page
	 */
	public getAccountSettings(useSettings = true): string {
		if (useSettings) {
			return `${this.prefix}nv/settings/account`;
		}
		return `${this.prefix}nv/account`;
	}

	/**
	 * Returns the URL for the sticker settings page
	 *
	 * @returns {string} The URL for the sticker settings page
	 */
	public getStickerSettings(useSettings = true): string {
		if (useSettings) {
			return `${this.prefix}nv/settings/sticker`;
		}
		return `${this.prefix}nv/stickerSettings`;
	}

	/**
	 * Returns the URL for the chat settings page
	 *
	 * @returns {string} The URL for the chat settings page
	 */
	public getChatSettings(useSettings = true): string {
		if (useSettings) {
			return `${this.prefix}nv/settings/chatSettings`;
		}
		return `${this.prefix}nv/chatVoiceCallSettings`;
	}

	/**
	 * Returns the URL for the address book sync page
	 *
	 * @returns {string} The URL for the address book sync page
	 */
	public getAddressBookSync(useSettings = true): string {
		if (useSettings) {
			return `${this.prefix}nv/settings/addressBookSync`;
		}
		return `${this.prefix}nv/friendsSettings`;
	}

	/**
	 * Returns the URL for the timeline settings page
	 *
	 * @returns {string} The URL for the timeline settings page
	 */
	public getTimelineSettings(useSettings = true): string {
		if (useSettings) {
			return `${this.prefix}nv/settings/timelineSettings`;
		}
		return `${this.prefix}nv/timelineSettings`;
	}

	/**
	 * Returns the URL for the my sticker page
	 *
	 * @returns {string} The URL for the my sticker page
	 */
	public getMySticker(): string {
		return `${this.prefix}nv/stickerShop/mySticker`;
	}

	/**
	 * Returns the URL for the device link page
	 *
	 * @returns {string} The URL for the device link page
	 */
	public getDeviceLink(): string {
		return `${this.prefix}nv/things/deviceLink`;
	}

	/**
	 * Returns the URL for the new post page
	 *
	 * @returns {string} The URL for the new post page
	 */
	public getNewPost(): string {
		return `${this.prefix}nv/timeline/post`;
	}

	/**
	 * Returns the URL for the profile popup page
	 *
	 * @param {string} [mid] memberId
	 * @returns {string} The URL for the profile popup page
	 */
	public getProfilePopup(mid: string): string {
		return `${this.prefix}nv/profilePopup/mid=${mid}`;
	}

	/**
	 * Returns the URL for the jump to chat message page
	 *
	 * @returns {string} The URL for the jump to chat message page
	 */
	public getJumpToChatMsg(groupId: string, messageId: string): string {
		return `${this.prefix}nv/chatMsg?chatId=${groupId}&messageId=${messageId}`;
	}

	/**
	 * Returns the URL for the recommend Q&A page
	 *
	 * @returns {string} The URL for the recommend Q&A page
	 */
	public getRecommendOA(oaId: string): string {
		return `${this.prefix}nv/recommendOA/${oaId}`;
	}

	/**
	 * Returns the URL for any channel page
	 *
	 * @param {string} [ch] channelId
	 * @returns {string} The URL for any channel page
	 */
	public getCh(ch = ""): string {
		return `${this.prefix}ch${ch}`;
	}

	/**
	 * Returns the URL for the liff app page
	 *
	 * @param {string} [id] liffId
	 * @param {boolean} [useLiff=false] use 'liff.line.me' url.
	 * @param param {Record<string, string>} url query
	 * @returns {string} The URL for the liff app page
	 */
	public getLiffApp(
		id = "",
		useLiff = false,
		param: Record<string, string> = {},
	): string {
		const urlParam = `?${new URLSearchParams(param).toString()}`;
		if (useLiff) {
			return `https://liff.line.me/${id}${urlParam}`;
		}
		return `${this.prefix}app/${id}${urlParam}`;
	}

	/**
	 * Returns the URL for the official account liffSticker
	 *
	 * @param {boolean} [useLiff=false] use 'liff.line.me' url.
	 * @param param {Record<string, string>} url query
	 * @returns {string} The URL for the official account liffSticker
	 */
	public getOfficialAccountLiff(
		useLiff = false,
		param: Record<string, string> = {},
	): string {
		return this.getLiffApp("1645278921-kWRPP32q", useLiff, param);
	}

	/**
	 * Returns the URL for the vote liffSticker
	 *
	 * @param {boolean} [useLiff=false] use 'liff.line.me' url.
	 * @param param {Record<string, string>} url query
	 * @returns {string} The URL for the vote liffSticker
	 */
	public getVoteLiff(
		useLiff = false,
		param: Record<string, string> = {},
	): string {
		return this.getLiffApp("1477715170-Pl2JnXpR", useLiff, param);
	}

	/**
	 * Returns the URL for the spam filter liffSticker
	 *
	 * @param {boolean} [useLiff=false] use 'liff.line.me' url.
	 * @param param {Record<string, string>} url query
	 * @returns {string} The URL for the spam filter liffSticker
	 */
	public getSpamFilterLiff(
		useLiff = false,
		param: Record<string, string> = {},
	): string {
		return this.getLiffApp("1556150347-zL2b31Eq", useLiff, param);
	}

	/**
	 * Returns the URL for the auto reply liffSticker
	 *
	 * @param {boolean} [useLiff=false] use 'liff.line.me' url.
	 * @param param {Record<string, string>} url query
	 * @returns {string} The URL for the auto reply liffSticker
	 */
	public getAutoReplyLiff(
		useLiff = false,
		param: Record<string, string> = {},
	): string {
		return this.getLiffApp("1655702173-mvkgA1yR", useLiff, param);
	}

	/**
	 * Returns the URL for the translate liffSticker
	 *
	 * @param {boolean} [useLiff=false] use 'liff.line.me' url.
	 * @param param {Record<string, string>} url query
	 * @returns {string} The URL for the translate liffSticker
	 */
	public getTlanslateLiff(
		useLiff = false,
		param: Record<string, string> = {},
	): string {
		return this.getLiffApp("1506931274-R5LDWmAW", useLiff, param);
	}

	/**
	 * Returns the URL for the gift liffSticker
	 *
	 * @param {boolean} [useLiff=false] use 'liff.line.me' url.
	 * @param param {Record<string, string>} url query
	 * @returns {string} The URL for the gift liffSticker
	 */
	public getGiftLiff(
		useLiff = false,
		param: Record<string, string> = {},
	): string {
		return this.getLiffApp("1654120723-lYaWZEb6", useLiff, param);
	}

	/**
	 * Returns the URL for the square liffSticker
	 *
	 * @param {boolean} [useLiff=false] use 'liff.line.me' url.
	 * @param param {Record<string, string>} url query
	 * @returns {string} The URL for the square liffSticker
	 */
	public getSquareLiff(
		useLiff = false,
		param: Record<string, string> = {},
	): string {
		return this.getLiffApp("1573545970-LlNdaE20", useLiff, param);
	}

	/**
	 * Returns the URL for the point club liffSticker
	 *
	 * @param {boolean} [useLiff=false] use 'liff.line.me' url.
	 * @param param {Record<string, string>} url query
	 * @returns {string} The URL for the point club liffSticker
	 */
	public getPointClubLiff(
		useLiff = false,
		param: Record<string, string> = {},
	): string {
		return this.getLiffApp("1370466387-VxxzrzRW", useLiff, param);
	}

	/**
	 * Returns the URL for the schedule liffSticker
	 *
	 * @param {boolean} [useLiff=false] use 'liff.line.me' url.
	 * @param param {Record<string, string>} url query
	 * @returns {string} The URL for the schedule liffSticker
	 */
	public getScheduleLiff(
		useLiff = false,
		param: Record<string, string> = {},
	): string {
		return this.getLiffApp("1655112642-8v0aXBwM", useLiff, param);
	}

	/**
	 * Returns the URL for the coupon liffSticker
	 *
	 * @param {boolean} [useLiff=false] use 'liff.line.me' url.
	 * @param param {Record<string, string>} url query
	 * @returns {string} The URL for the coupon liffSticker
	 */
	public getCouponLiff(
		useLiff = false,
		param: Record<string, string> = {},
	): string {
		return this.getLiffApp("1611905212-3bydBEmv", useLiff, param);
	}

	/**
	 * Returns the URL for the sticker shop liffSticker
	 *
	 * @param {boolean} [useLiff=false] use 'liff.line.me' url.
	 * @param param {Record<string, string>} url query
	 * @returns {string} The URL for the sticker shop liffSticker
	 */
	public getStickerShopLiff(
		useLiff = false,
		param: Record<string, string> = {},
	): string {
		return this.getLiffApp("1359301715-JKd7Y7j1", useLiff, param);
	}

	/**
	 * Returns the URL for the dress-up shop liffSticker
	 *
	 * @param {boolean} [useLiff=false] use 'liff.line.me' url.
	 * @param param {Record<string, string>} url query
	 * @returns {string} The URL for the dress-up shop liffSticker
	 */
	public getDressUpShopLiff(
		useLiff = false,
		param: Record<string, string> = {},
	): string {
		return this.getLiffApp("1359301715-lw9jxjqV", useLiff, param);
	}

	/**
	 * Returns the URL for the sticker category page
	 *
	 * @param {string} [categoryId] categoryId
	 * @returns {string} The URL for the sticker category page
	 */
	public getStickerCategory(categoryId: string): string {
		return `${this.prefix}shop/sticker/category/${categoryId}`;
	}

	/**
	 * Returns the URL for the sticker package page
	 *
	 * @param {string} [packageId] packageId
	 * @returns {string} The URL for the sticker package page
	 */
	public getStickerPackage(packageId: string): string {
		return `${this.prefix}shop/sticker/detail/${packageId}`;
	}

	/**
	 * Returns the URL for the sticker author page
	 *
	 * @param {string} [authorId] authorId
	 * @returns {string} The URL for the sticker author page
	 */
	public getStickerAuthor(authorId: string): string {
		return `${this.prefix}shop/sticker/author/${authorId}`;
	}

	/**
	 * Returns the URL for the sticker product page
	 *
	 * @param {string} [productId] productId
	 * @returns {string} The URL for the sticker product page
	 */
	public getStickerProduct(productId: string): string {
		return `${this.prefix}shop/theme/detail?id=${productId}`;
	}

	/**
	 * Returns the URL for the square main page
	 *
	 * @returns {string} The URL for the square main page
	 */
	public getSquareMain(): string {
		return `${this.prefix}square/main`;
	}

	/**
	 * Returns the URL for the square create page
	 *
	 * @returns {string} The URL for the square create page
	 */
	public getSquareCreate(): string {
		return `${this.prefix}square/createSquare`;
	}

	/**
	 * Returns the URL for the square report page
	 *
	 * @param {string} [ticketOrEmid] ticket or emid (by isTicket)
	 * @param {boolean} [isTicket=true] is ticket.
	 * @returns {string} The URL for the square report page
	 */
	public getSquareReport(ticketOrEmid: string, isTicket = true): string {
		if (isTicket) {
			return `${this.prefix}square/report?ticket=${ticketOrEmid}`;
		}
		return `${this.prefix}square/report?emid=${ticketOrEmid}`;
	}

	/**
	 * Returns the URL for the square join page
	 *
	 * @param {string} [ticketOrEmid] ticket or emid (by isTicket)
	 * @param {boolean} [isTicket=true] is ticket.
	 * @returns {string} The URL for the square join page
	 */
	public getSquareJoin(ticketOrEmid: string, isTicket = true): string {
		if (isTicket) {
			return `${this.prefix}square/join?ticket=${ticketOrEmid}`;
		}
		return `${this.prefix}square/join?emid=${ticketOrEmid}`;
	}

	/**
	 * Returns the URL for the square home page
	 *
	 * @param {string} [emid] encryptedSquareMid
	 * @returns {string} The URL for the square home page
	 */
	public getSquareHome(emid: string): string {
		return `${this.prefix}square/home?encryptedSquareMid=${emid}`;
	}

	/**
	 * Returns the URL for the square note post page
	 *
	 * @param {string} [squareMid] squareMid
	 * @param {string} [postId] postId
	 * @returns {string} The URL for the square note post page
	 */
	public getSquareNotePost(squareMid: string, postId: string): string {
		return `${this.prefix}square/post?squareMid=${squareMid}&postId=${postId}&sourceType=TALKROOM_HOME`;
	}

	/**
	 * Returns the URL for the user ticket page
	 *
	 * @param {string} [ticket] user ticket
	 * @returns {string} The URL for the user ticket page
	 */
	public getUserTicket(ticket: string): string {
		return `${this.prefix}ti/p/${ticket}`;
	}

	/**
	 * Returns the URL for the userId search page
	 *
	 * @param {string} [userId] userId
	 * @returns {string} The URL for the userId search page
	 */
	public getUserIdSearch(userId: string): string {
		return `${this.prefix}ti/p/~${userId}`;
	}

	/**
	 * Returns the URL for the group ticket page
	 *
	 * @param {string} [ticket] group ticket
	 * @returns {string} The URL for the group ticket page
	 */
	public getGroupTicket(ticket: string): string {
		return `${this.prefix}ti/g/${ticket}`;
	}

	/**
	 * Returns the URL for the square group ticket page
	 *
	 * @param {string} [ticket] square group ticket
	 * @returns {string} The URL for the square group ticket page
	 */
	public getSquareTicket(ticket: string): string {
		return `${this.prefix}ti/g2/${ticket}`;
	}

	/**
	 * Returns the URL for the text share page
	 *
	 * @param {string} [text] share text
	 * @param {boolean} [useShare=true] use share.
	 * @returns {string} The URL for the text share page
	 */
	public getTextShare(text: string, useShare = true): string {
		if (useShare) {
			return `${this.prefix}share?text=${encodeURIComponent(text)}`;
		}
		return `${this.prefix}msg/text/${encodeURIComponent(text)}`;
	}

	/**
	 * Returns the URL for the oa message page
	 *
	 * @param {string} [oaId] oa id
	 * @param {string} [text] text
	 * @returns {string} The URL for the oa message page
	 */
	public getOaMessage(oaId: string, text: string): string {
		return `${this.prefix}oaMessage/${oaId}/?${text}`;
	}

	/**
	 * Returns the URL for the album page
	 *
	 * @returns {string} The URL for the album page
	 */
	public getAlbums(): string {
		return `${this.prefix}moa/albums/album`;
	}

	/**
	 * Returns the URL for the user post page
	 *
	 * @param {string} [userMid] user mid
	 * @param {string} [postId] post id
	 * @returns {string} The URL for the user post page
	 */
	public getUserPost(userMid: string, postId: string): string {
		return `${this.prefix}home/post?userMid=${userMid}&postId=${postId}`;
	}

	/**
	 * Returns the URL for the oa main page
	 *
	 * @param {string} [oaIdWithoutAT] oa id without AT
	 * @returns {string} The URL for the oa main page
	 */
	public getOaMain(oaIdWithoutAT: string): string {
		return `${this.prefix}home/public/main?id=${oaIdWithoutAT}`;
	}

	/**
	 * Returns the URL for the oa profile page
	 *
	 * @param {string} [oaIdWithoutAT] oa id without AT
	 * @returns {string} The URL for the oa profile page
	 */
	public getOaProfile(oaIdWithoutAT: string): string {
		return `${this.prefix}home/public/profile?id=${oaIdWithoutAT}`;
	}

	/**
	 * Returns the URL for the oa post page
	 *
	 * @param {string} [oaIdWithoutAT] oa id without AT
	 * @param {string} [postId] post id
	 * @returns {string} The URL for the oa post page
	 */
	public getOaPost(oaIdWithoutAT: string, postId: string): string {
		return `${this.prefix}home/public/post?id=${oaIdWithoutAT}&postId=${postId}`;
	}

	/**
	 * Returns the URL for the group camera page
	 *
	 * @param {string} [oaIdWithoutAT] oa id without AT
	 * @returns {string} The URL for the group camera page
	 */
	public getGroupCreate(): string {
		return `${this.prefix}group/create`;
	}

	/**
	 * Returns the URL for the group post page
	 *
	 * @param {string} [groupId] gruop id
	 * @param {string} [postId] post id
	 * @returns {string} The URL for the group post page
	 */
	public getGroupPost(groupId: string, postId: string): string {
		return `${this.prefix}group/home/posts/post?homeId=${groupId}&postId=${postId}`;
	}

	/**
	 * Returns the URL for the group album page
	 *
	 * @param {string} [albumId] album id
	 * @param {string} [groupId] gruop id
	 * @returns {string} The URL for the group album page
	 */
	public getGroupAlbum(albumId: string, groupId: string): string {
		return `${this.prefix}group/home/albums/album?albumId=${albumId}&homeId=${groupId}&albumIdV2=${albumId}`;
	}
}

export { LINE_SCHEME_BASE as LINE_SCHEME };
