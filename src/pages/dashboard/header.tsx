import { useId } from "react";
import ComboboxChangeLanguage from "@/components/combobox-change-language";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useLanguageKey } from "@/hooks/use-i18n";

export default function Header() {
	const buttons = useLanguageKey("buttons") as Record<string, string>;

	const removeBgId = useId();
	const convertToPDF = useId();

	return (
		<header className="flex flex-wrap gap-4 justify-between items-center border-1 rounded-b-lg p-2.5">
			<section className="flex flex-wrap items-center gap-4">
				<ModeToggle />
				<ComboboxChangeLanguage />
			</section>

			<section className="flex flex-wrap items-center gap-4">
				<div>
					<Label htmlFor={removeBgId} className="cursor-pointer py-2">
						<Checkbox
							id={removeBgId}
							defaultChecked
							className="cursor-pointer"
						/>
						{buttons["button-remove-background"]}
					</Label>
				</div>

				<div>
					<Label htmlFor={convertToPDF} className="cursor-pointer py-2">
						<Checkbox
							id={convertToPDF}
							defaultChecked
							className="cursor-pointer"
						/>
						{buttons["button-convert-to-pdf"]}
					</Label>
				</div>

				<div>
					<Button className="cursor-pointer">{buttons["button-save"]}</Button>
				</div>
			</section>
		</header>
	);
}
