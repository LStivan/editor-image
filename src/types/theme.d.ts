type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
};

interface ThemeOption {
	value: Theme;
	label: string;
}

export type { Theme, ThemeProviderProps, ThemeProviderState, ThemeOption };
