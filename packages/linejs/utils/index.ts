/**
 * @module
 * Utility for LINE
 */

import { getSquare, searchSquare } from "./functions/index.ts";
import { LINE_OBS } from "./obs/index.ts";
import { LINE_REGEX } from "./regex/index.ts";
import { LINE_SCHEME } from "./scheme/index.ts";

export { getSquare, LINE_OBS, LINE_REGEX, LINE_SCHEME, searchSquare };

export default {
	LINE_SCHEME,
	LINE_OBS,
	LINE_REGEX,
	LINE_FUNCTIONS: {
		searchSquare,
		getSquare,
	},
};
