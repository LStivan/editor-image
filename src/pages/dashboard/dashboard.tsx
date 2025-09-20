import { type DragEvent, useCallback, useState } from "react";
import { Board } from "@/components/board";
import Header from "@/components/header";
import { useKanbanContext } from "@/contexts/kanban-context";
import type { ImageItem } from "@/types/kanban";

export default function Dashboard() {
	const [isDragging, setIsDragging] = useState(false);
	const { addImagesToFirstColumn, toggleAllColumnsSave, areAllColumnsSaved } =
		useKanbanContext();

	const handleDrop = useCallback(
		async (e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			setIsDragging(false);

			const url =
				e.dataTransfer.getData("text/uri-list") ||
				e.dataTransfer.getData("text/plain");

			if (url && /^https?:\/\//i.test(url)) {
				if (/\.(jpe?g|png|gif|webp|avif|svg)(\?|$)/i.test(url)) {
					const fileName =
						decodeURIComponent(
							new URL(url).pathname.split("/").pop() || "image",
						) || "image";
					const newImage: ImageItem = {
						id: crypto.randomUUID(),
						src: url,
						fileName,
						rotation: 0,
						size: 0,
					};
					addImagesToFirstColumn([newImage]);
					return;
				}
			}

			const files = Array.from(e.dataTransfer.files);
			const imageFiles = files.filter((f) => f.type.startsWith("image/"));
			if (imageFiles.length > 0) {
				const newImages: ImageItem[] = imageFiles.map((file) => ({
					id: crypto.randomUUID(),
					src: URL.createObjectURL(file),
					fileName: file.name,
					rotation: 0,
					size: file.size,
				}));
				addImagesToFirstColumn(newImages);
			}
		},
		[addImagesToFirstColumn],
	);

	const handleToggleAllChange = useCallback(
		(checked: boolean) => {
			toggleAllColumnsSave(checked);
		},
		[toggleAllColumnsSave],
	);

	return (
		<div className="h-screen flex flex-col">
			<Header
				toggleAllColumnsSave={toggleAllColumnsSave}
				areAllColumnsSaved={areAllColumnsSaved}
				onToggleAllChange={handleToggleAllChange}
			/>
			<section
				className={[
					"flex-grow relative border-2 border-dashed rounded-xl m-4 transition-all duration-300",
					isDragging
						? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-inner"
						: "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800",
				].join(" ")}
				onDragOver={(e) => {
					e.preventDefault();
					if (!isDragging) setIsDragging(true);
				}}
				onDragLeave={() => setIsDragging(false)}
				onDrop={handleDrop}
				aria-label="Área para arrastar e soltar imagens"
			>
				<Board />
			</section>
		</div>
	);
}
