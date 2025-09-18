import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguageKey } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import { useI18nContext } from "@/providers/i18n-provider";
import type { LanguageInfo } from "@/types/language";

export default function ComboboxChangeLanguage() {
  const { locale, t, setLocale } = useI18nContext();
  const [open, setOpen] = React.useState(false);

  const placeholder = useLanguageKey("combobox.placeholder") as string;
  const searchPlaceholder = useLanguageKey(
    "combobox.search-placeholder"
  ) as string;
  const noLanguageFound = useLanguageKey(
    "combobox.no-language-found"
  ) as string;

  const languages = Object.entries(t["languages-selected"].locales).map(
    ([code, info]) => {
      const lang = info as LanguageInfo;
      return {
        value: code,
        label: lang.label,
        flag: lang.flag,
        defaultSelected: lang["default-selected"] ?? false,
      };
    }
  );

  const [value, setValue] = React.useState<string>(locale);

  const handleSelect = (selected: string) => {
    setValue(selected);
    setLocale(selected);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between cursor-pointer"
        >
          {languages.find((lang) => lang.value === value)?.label ?? placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{noLanguageFound}</CommandEmpty>
            <CommandGroup>
              {languages.map((lang) => (
                <CommandItem
                  key={lang.value}
                  value={lang.value}
                  onSelect={() => handleSelect(lang.value)}
                  className="cursor-pointer"
                >
                  <p>{lang.label}</p>
                  <Check
                    className={cn(
                      "ml-auto",
                      value === lang.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
