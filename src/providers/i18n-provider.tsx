import { createContext, type ReactNode, useContext, useState } from "react";
import type { I18nJSON } from "@/types/i18n";

const modules = import.meta.glob("@/locales/*.json", { eager: true });

type SupportedLocale = keyof typeof modules;
type LocaleMap = Record<SupportedLocale, I18nJSON>;

const locales: LocaleMap = {} as LocaleMap;

for (const path in modules) {
	const match = path.match(/\/([\w-]+)\.json$/);
	if (!match) continue;
	const code = match[1] as SupportedLocale;
	const module = modules[path] as { default: I18nJSON };
	locales[code] = module.default;
}

interface I18nContextType {
	locale: SupportedLocale;
	t: I18nJSON;
	setLocale: (locale: SupportedLocale) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
	const [locale, setLocale] = useState<SupportedLocale>("pt-br");

	return (
		<I18nContext.Provider value={{ locale, t: locales[locale], setLocale }}>
			{children}
		</I18nContext.Provider>
	);
};

export const useI18nContext = (): I18nContextType => {
	const ctx = useContext(I18nContext);
	if (!ctx) throw new Error("useI18nContext must be used within I18nProvider");
	return ctx;
};
