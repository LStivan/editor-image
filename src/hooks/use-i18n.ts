import { get } from "lodash-es";
import { useI18nContext } from "@/providers/i18n-provider";
import type { I18nJSON, I18nKeys } from "@/types/i18n";

// Pega toda uma seção do JSON
export function useLanguage<K extends keyof I18nJSON>(key?: K) {
  const { t } = useI18nContext();
  if (!key) return t;
  return get(t, key as string);
}

// Pega uma chave específica usando dot notation tipada
export function useLanguageKey<K extends I18nKeys>(key: K) {
  const { t } = useI18nContext();
  return get(t, key) as unknown;
}
