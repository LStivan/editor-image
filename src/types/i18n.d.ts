import type ptBr from "@/locales/pt-br.json";

type DotPrefix<T extends string> = T extends "" ? "" : `${T}.`;

type DotNestedKeys<T> = T extends object
	? {
			[K in keyof T]-?: K extends string
				? T[K] extends object
					? `${K}` | `${DotPrefix<K>}${DotNestedKeys<T[K]>}`
					: `${K}`
				: never;
		}[keyof T]
	: "";

export type I18nKeys = DotNestedKeys<typeof ptBr>;

export type I18nJSON = typeof ptBr;
