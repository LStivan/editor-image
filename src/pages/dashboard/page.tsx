import ComboboxChangeLanguage from "@/components/combobox-change-language";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="flex flex-wrap gap-4 justify-between items-center border-1 rounded-b-lg p-2.5">
      <section className="flex flex-wrap items-center gap-4">
        <ModeToggle />
        <ComboboxChangeLanguage />
      </section>

      <section>
        <Button className="cursor-pointer">Salvar</Button>
      </section>
    </header>
  );
}
