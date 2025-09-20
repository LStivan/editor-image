import { useEffect, useId, useState } from "react";
import ComboboxChangeLanguage from "@/components/combobox-change-language";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useLanguageKey } from "@/hooks/use-i18n";
import type { HeaderProps } from "@/types/header";

export default function Header({
	areAllColumnsSaved,
	onToggleAllChange,
	toggleAllColumnsSave,
}: HeaderProps) {
	const buttons = useLanguageKey("buttons") as Record<string, string>;
	const toggleButtonLabels = useLanguageKey(
		"buttons.button-toggle-selected-all",
	) as Record<string, string>;

	const removeBgId = useId();
	const convertToPDF = useId();
	const toggleAllColumns = useId();

	const [isToggleAllChecked, setIsToggleAllChecked] = useState(false);

	useEffect(() => {
		setIsToggleAllChecked(areAllColumnsSaved ?? false);
	}, [areAllColumnsSaved]);

	const handleToggleAllChange = (checked: boolean) => {
		setIsToggleAllChecked(checked);
		onToggleAllChange?.(checked);
		toggleAllColumnsSave?.(checked);
	};

	return (
		<header className="flex flex-wrap gap-4 justify-between items-center border-1 rounded-b-lg p-2.5">
			<section className="flex flex-wrap items-center gap-4">
				<ModeToggle />
				<ComboboxChangeLanguage />
			</section>

			<section className="flex flex-wrap items-center gap-4">
				<div className="flex items-center gap-2">
					<Label htmlFor={toggleAllColumns} className="cursor-pointer py-2">
						<Checkbox
							id={toggleAllColumns}
							className="cursor-pointer"
							checked={isToggleAllChecked}
							onCheckedChange={(checked) =>
								handleToggleAllChange(checked as boolean)
							}
						/>
						{isToggleAllChecked
							? toggleButtonLabels.disabled
							: toggleButtonLabels.active}
					</Label>
				</div>

				<div className="flex items-center gap-2">
					<Label htmlFor={removeBgId} className="cursor-pointer py-2">
						<Checkbox
							id={removeBgId}
							defaultChecked
							className="cursor-pointer"
						/>
						{buttons["button-remove-background"]}
					</Label>
				</div>

				<div className="flex items-center gap-2">
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
