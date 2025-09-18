type LanguageInfo = {
	label: string;
	flag: string;
	"default-selected"?: boolean;
};

export type Language = {
	[key: string]: LanguageInfo;
};
