// Map of AWS Translate supported language codes to a primary color (oklch format) for each language/country
export const LANGUAGE_COLOR_MAP: Record<string, string> = {
	af: "oklch(65% 0.15 120)", // South Africa (green from flag)
	sq: "oklch(60% 0.20 29)", // Albania (red from flag)
	am: "oklch(65% 0.15 120)", // Ethiopia (green from flag)
	ar: "oklch(65% 0.15 120)", // Saudi Arabia (green from flag)
	hy: "oklch(60% 0.20 29)", // Armenia (red from flag)
	az: "oklch(55% 0.20 200)", // Azerbaijan (blue from flag)
	bn: "oklch(65% 0.15 120)", // Bangladesh (green from flag)
	bs: "oklch(55% 0.20 240)", // Bosnia (blue from flag)
	bg: "oklch(85% 0.05 100)", // Bulgaria (white/light from flag)
	ca: "oklch(75% 0.15 60)", // Catalonia (yellow from flag)
	zh: "oklch(60% 0.20 29)", // China (red from flag)
	"zh-TW": "oklch(55% 0.20 240)", // Taiwan (blue from flag)
	hr: "oklch(60% 0.20 29)", // Croatia (red from flag)
	cs: "oklch(55% 0.20 240)", // Czech Republic (blue from flag)
	da: "oklch(60% 0.20 29)", // Denmark (red from flag)
	nl: "oklch(65% 0.18 60)", // Netherlands (orange from flag)
	en: "oklch(50% 0.15 240)", // UK (navy blue from Union Jack)
	et: "oklch(55% 0.20 240)", // Estonia (blue from flag)
	fi: "oklch(55% 0.20 240)", // Finland (blue from flag)
	fr: "oklch(55% 0.20 240)", // France (blue from flag)
	"fr-CA": "oklch(60% 0.20 29)", // Canada (red from flag)
	ka: "oklch(85% 0.05 0)", // Georgia (white from flag)
	de: "oklch(10% 0.05 0)", // Germany (black from flag)
	el: "oklch(55% 0.20 240)", // Greece (blue from flag)
	gu: "oklch(70% 0.15 60)", // India/Gujarat (saffron from flag)
	ht: "oklch(55% 0.20 240)", // Haiti (blue from flag)
	ha: "oklch(65% 0.15 120)", // Nigeria (green from flag)
	he: "oklch(55% 0.20 240)", // Israel (blue from flag)
	hi: "oklch(70% 0.15 60)", // India (saffron from flag)
	hu: "oklch(60% 0.20 29)", // Hungary (red from flag)
	is: "oklch(55% 0.20 240)", // Iceland (blue from flag)
	id: "oklch(60% 0.20 29)", // Indonesia (red from flag)
	ga: "oklch(65% 0.15 120)", // Ireland (green from flag)
	it: "oklch(65% 0.15 120)", // Italy (green from flag)
	ja: "oklch(85% 0.05 0)", // Japan (white background with red circle)
	kn: "oklch(70% 0.15 60)", // India/Karnataka (saffron from flag)
	kk: "oklch(55% 0.20 200)", // Kazakhstan (sky blue from flag)
	ko: "oklch(85% 0.05 0)", // South Korea (white from flag)
	lv: "oklch(60% 0.20 29)", // Latvia (dark red from flag)
	lt: "oklch(75% 0.15 60)", // Lithuania (yellow from flag)
	mk: "oklch(60% 0.20 29)", // North Macedonia (red from flag)
	ms: "oklch(55% 0.20 240)", // Malaysia (blue from flag)
	ml: "oklch(70% 0.15 60)", // India/Malayalam (saffron from flag)
	mt: "oklch(85% 0.05 0)", // Malta (white from flag)
	mr: "oklch(70% 0.15 60)", // India/Marathi (saffron from flag)
	mn: "oklch(55% 0.20 240)", // Mongolia (blue from flag)
	no: "oklch(60% 0.20 29)", // Norway (red from flag)
	ps: "oklch(30% 0.05 0)", // Afghanistan (black from flag)
	pl: "oklch(85% 0.05 0)", // Poland (white from flag)
	pt: "oklch(65% 0.15 120)", // Portugal (green from flag)
	ro: "oklch(55% 0.20 240)", // Romania (blue from flag)
	ru: "oklch(85% 0.05 0)", // Russia (white from flag)
	sr: "oklch(60% 0.20 29)", // Serbia (red from flag)
	si: "oklch(70% 0.15 60)", // Sri Lanka (orange from flag)
	sk: "oklch(85% 0.05 0)", // Slovakia (white from flag)
	sl: "oklch(85% 0.05 0)", // Slovenia (white from flag)
	so: "oklch(55% 0.20 200)", // Somalia (light blue from flag)
	es: "oklch(60% 0.20 29)", // Spain (red from flag)
	sw: "oklch(30% 0.05 0)", // Kenya (black from flag)
	sv: "oklch(75% 0.15 60)", // Sweden (yellow from flag)
	tl: "oklch(55% 0.20 240)", // Philippines (blue from flag)
	ta: "oklch(70% 0.15 60)", // India/Tamil (saffron from flag)
	te: "oklch(70% 0.15 60)", // India/Telugu (saffron from flag)
	th: "oklch(60% 0.20 29)", // Thailand (red from flag)
	tr: "oklch(60% 0.20 29)", // Turkey (red from flag)
	uk: "oklch(75% 0.15 60)", // Ukraine (yellow from flag)
	ur: "oklch(65% 0.15 120)", // Pakistan (green from flag)
	uz: "oklch(55% 0.20 200)", // Uzbekistan (blue from flag)
	vi: "oklch(60% 0.20 29)", // Vietnam (red from flag)
	cy: "oklch(60% 0.20 29)", // Wales (red from Welsh dragon)
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
