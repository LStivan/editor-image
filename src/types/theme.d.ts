type ThemeValue = "light" | "dark" | "system";

interface ThemeOption {
	value: ThemeValue;
	label: string;
}

export type { ThemeOption, ThemeValue };
