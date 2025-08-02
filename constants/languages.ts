// Map of AWS Translate supported language codes to a primary color (oklch format) for each language/country
export const LANGUAGE_COLOR_MAP: Record<string, string> = {
	af: "oklch(70% 0.18 120)", // South Africa (green)
	sq: "oklch(70% 0.18 29)", // Albanian (red)
	am: "oklch(70% 0.18 40)", // Amharic (blue)
	ar: "oklch(70% 0.18 120)", // Arabic (green)
	hy: "oklch(70% 0.18 29)", // Armenian (red)
	az: "oklch(70% 0.18 200)", // Azerbaijani (blue)
	bn: "oklch(70% 0.18 120)", // Bengali (green)
	bs: "oklch(70% 0.18 29)", // Bosnian (red)
	bg: "oklch(70% 0.18 120)", // Bulgarian (green)
	ca: "oklch(70% 0.18 80)", // Catalan (red/yellow, but red is dominant)
	zh: "oklch(70% 0.18 29)", // Chinese (red)
	"zh-TW": "oklch(70% 0.18 100)", // Chinese (Traditional) (yellow)
	hr: "oklch(70% 0.18 29)", // Croatian (red)
	cs: "oklch(70% 0.18 240)", // Czech (blue)
	da: "oklch(70% 0.18 29)", // Danish (red)
	nl: "oklch(70% 0.18 60)", // Dutch (orange)
	en: "oklch(70% 0.18 250)", // English (blue)
	et: "oklch(70% 0.18 120)", // Estonian (green)
	fi: "oklch(70% 0.18 240)", // Finnish (blue)
	fr: "oklch(70% 0.18 240)", // French (blue)
	"fr-CA": "oklch(70% 0.18 240)", // French (Canada) (blue)
	ka: "oklch(70% 0.18 29)", // Georgian (red)
	de: "oklch(30% 0.05 0)", // German (black)
	el: "oklch(70% 0.18 240)", // Greek (blue)
	gu: "oklch(70% 0.18 120)", // Gujarati (green)
	ht: "oklch(70% 0.18 240)", // Haitian Creole (blue)
	ha: "oklch(70% 0.18 120)", // Hausa (green)
	he: "oklch(70% 0.18 250)", // Hebrew (blue)
	hi: "oklch(70% 0.18 29)", // Hindi (red)
	hu: "oklch(70% 0.18 240)", // Hungarian (blue)
	is: "oklch(70% 0.18 240)", // Icelandic (blue)
	id: "oklch(70% 0.18 120)", // Indonesian (green)
	ga: "oklch(70% 0.18 120)", // Irish (green)
	it: "oklch(70% 0.18 120)", // Italian (green)
	ja: "oklch(70% 0.18 270)", // Japanese (purple)
	kn: "oklch(70% 0.18 120)", // Kannada (green)
	kk: "oklch(70% 0.18 120)", // Kazakh (green)
	ko: "oklch(70% 0.18 250)", // Korean (blue)
	lv: "oklch(70% 0.18 120)", // Latvian (green)
	lt: "oklch(70% 0.18 120)", // Lithuanian (green)
	mk: "oklch(70% 0.18 240)", // Macedonian (blue)
	ms: "oklch(70% 0.18 120)", // Malay (green)
	ml: "oklch(70% 0.18 120)", // Malayalam (green)
	mt: "oklch(70% 0.18 80)", // Maltese (red/yellow, but red is dominant)
	mr: "oklch(70% 0.18 29)", // Marathi (red)
	mn: "oklch(70% 0.18 240)", // Mongolian (blue)
	no: "oklch(70% 0.18 240)", // Norwegian (blue)
	ps: "oklch(70% 0.18 120)", // Pashto (green)
	pl: "oklch(70% 0.18 240)", // Polish (blue)
	pt: "oklch(70% 0.18 80)", // Portuguese (yellow)
	ro: "oklch(70% 0.18 29)", // Romanian (red)
	ru: "oklch(70% 0.18 240)", // Russian (blue)
	sr: "oklch(70% 0.18 240)", // Serbian (blue)
	si: "oklch(70% 0.18 120)", // Sinhala (green)
	sk: "oklch(70% 0.18 240)", // Slovak (blue)
	sl: "oklch(70% 0.18 120)", // Slovenian (green)
	so: "oklch(70% 0.18 120)", // Somali (green)
	es: "oklch(70% 0.18 29)", // Spanish (red)
	sw: "oklch(70% 0.18 120)", // Swahili (green)
	sv: "oklch(70% 0.18 240)", // Swedish (blue)
	tl: "oklch(70% 0.18 80)", // Tagalog (yellow)
	ta: "oklch(70% 0.18 29)", // Tamil (red)
	te: "oklch(70% 0.18 29)", // Telugu (red)
	th: "oklch(70% 0.18 120)", // Thai (green)
	tr: "oklch(70% 0.18 29)", // Turkish (red)
	uk: "oklch(70% 0.18 240)", // Ukrainian (blue)
	ur: "oklch(70% 0.18 29)", // Urdu (red)
	uz: "oklch(70% 0.18 120)", // Uzbek (green)
	vi: "oklch(70% 0.18 120)", // Vietnamese (green)
	cy: "oklch(70% 0.18 120)", // Welsh (green)
};
// Map of AWS Translate supported language codes to human-readable names
export const LANGUAGE_NAME_MAP: Record<string, string> = {
	af: "Afrikaans",
	sq: "Albanian",
	am: "Amharic",
	ar: "Arabic",
	hy: "Armenian",
	az: "Azerbaijani",
	bn: "Bengali",
	bs: "Bosnian",
	bg: "Bulgarian",
	ca: "Catalan",
	zh: "Chinese (Simplified)",
	"zh-TW": "Chinese (Traditional)",
	hr: "Croatian",
	cs: "Czech",
	da: "Danish",
	nl: "Dutch",
	en: "English",
	et: "Estonian",
	fi: "Finnish",
	fr: "French",
	"fr-CA": "French (Canada)",
	ka: "Georgian",
	de: "German",
	el: "Greek",
	gu: "Gujarati",
	ht: "Haitian Creole",
	ha: "Hausa",
	he: "Hebrew",
	hi: "Hindi",
	hu: "Hungarian",
	is: "Icelandic",
	id: "Indonesian",
	ga: "Irish",
	it: "Italian",
	ja: "Japanese",
	kn: "Kannada",
	kk: "Kazakh",
	ko: "Korean",
	lv: "Latvian",
	lt: "Lithuanian",
	mk: "Macedonian",
	ms: "Malay",
	ml: "Malayalam",
	mt: "Maltese",
	mr: "Marathi",
	mn: "Mongolian",
	no: "Norwegian",
	ps: "Pashto",
	pl: "Polish",
	pt: "Portuguese",
	ro: "Romanian",
	ru: "Russian",
	sr: "Serbian",
	si: "Sinhala",
	sk: "Slovak",
	sl: "Slovenian",
	so: "Somali",
	es: "Spanish",
	sw: "Swahili",
	sv: "Swedish",
	tl: "Tagalog",
	ta: "Tamil",
	te: "Telugu",
	th: "Thai",
	tr: "Turkish",
	uk: "Ukrainian",
	ur: "Urdu",
	uz: "Uzbek",
	vi: "Vietnamese",
	cy: "Welsh",
};

// Map of AWS Translate supported language codes to their corresponding emoji flags
// Note: Some languages may not have a specific emoji flag, so the map uses the closest available representation.
export const LANGUAGE_EMOJI_MAP: Record<string, string> = {
	af: "🇿🇦",
	sq: "🇦🇱",
	am: "🇪🇹",
	ar: "🇸🇦",
	hy: "🇦🇲",
	az: "🇦🇿",
	bn: "🇧🇩",
	bs: "🇧🇦",
	bg: "🇧🇬",
	ca: "🇪🇸",
	zh: "🇨🇳",
	"zh-TW": "🇹🇼",
	hr: "🇭🇷",
	cs: "🇨🇿",
	da: "🇩🇰",
	nl: "🇳🇱",
	en: "🇬🇧",
	et: "🇪🇪",
	fi: "🇫🇮",
	fr: "🇫🇷",
	"fr-CA": "🇨🇦",
	ka: "🇬🇪",
	de: "🇩🇪",
	el: "🇬🇷",
	gu: "🇮🇳",
	ht: "🇭🇹",
	ha: "🇳🇬",
	he: "🇮🇱",
	hi: "🇮🇳",
	hu: "🇭🇺",
	is: "🇮🇸",
	id: "🇮🇩",
	ga: "🇮🇪",
	it: "🇮🇹",
	ja: "🇯🇵",
	kn: "🇮🇳",
	kk: "🇰🇿",
	ko: "🇰🇷",
	lv: "🇱🇻",
	lt: "🇱🇹",
	mk: "🇲🇰",
	ms: "🇲🇾",
	ml: "🇮🇳",
	mt: "🇲🇹",
	mr: "🇮🇳",
	mn: "🇲🇳",
	no: "🇳🇴",
	ps: "🇦🇫",
	pl: "🇵🇱",
	pt: "🇵🇹",
	ro: "🇷🇴",
	ru: "🇷🇺",
	sr: "🇷🇸",
	si: "🇱🇰",
	sk: "🇸🇰",
	sl: "🇸🇮",
	so: "🇸🇴",
	es: "🇪🇸",
	sw: "🇰🇪",
	sv: "🇸🇪",
	tl: "🇵🇭",
	ta: "🇮🇳",
	te: "🇮🇳",
	th: "🇹🇭",
	tr: "🇹🇷",
	uk: "🇺🇦",
	ur: "🇵🇰",
	uz: "🇺🇿",
	vi: "🇻🇳",
	cy: "🇬🇧",
};
