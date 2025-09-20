import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BtnCreateColumnProps } from "@/types/buttons";

export function BtnCreateColumn({ onClick }: BtnCreateColumnProps) {
	return (
		<Button
			onClick={onClick}
			className="cursor-pointer fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg"
			aria-label="Criar nova coluna"
		>
			<Plus className="w-6 h-6 text-white" />
		</Button>
	);
}
