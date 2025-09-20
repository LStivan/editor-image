import { Droppable } from "@hello-pangea/dnd";
import { X } from "lucide-react";
import { useCallback, useState } from "react";
import { ImageCard } from "@/components/image-card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useKanbanContext } from "@/contexts/kanban-context";
import { cn } from "@/lib/utils";
import type { ColumnProps } from "@/types/column";

export function ColumnComponent({
	column,
	onRemoveImage,
	onRotateImage,
	onDeleteColumn,
	isFirstColumn = false,
}: ColumnProps) {
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [title, setTitle] = useState(column.title);
	const { columns, updateColumnTitle, toggleColumnSave } = useKanbanContext();

	const currentColumn = columns.find((col) => col.id === column.id) || column;

	const handleTitleChange = useCallback(() => {
		updateColumnTitle(column.id, title);
		setIsEditingTitle(false);
	}, [column.id, updateColumnTitle, title]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter") {
				handleTitleChange();
			} else if (e.key === "Escape") {
				setTitle(column.title);
				setIsEditingTitle(false);
			}
		},
		[handleTitleChange, column.title],
	);

	return (
		<Droppable droppableId={column.id}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.droppableProps}
					className="flex flex-col w-64 min-w-[16rem] bg-gray-100 dark:bg-gray-800 rounded-lg shadow"
				>
					<div className="p-3 border-b border-gray-200 dark:border-gray-700">
						<div className="flex items-center justify-between mb-2">
							{isEditingTitle ? (
								<Input
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									onBlur={handleTitleChange}
									onKeyDown={handleKeyDown}
									autoFocus
									className="h-8 text-sm"
								/>
							) : (
								<button
									type="button"
									className={cn(
										"font-semibold text-gray-800 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded text-left",
									)}
									onClick={() => setIsEditingTitle(true)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											setIsEditingTitle(true);
										}
									}}
									aria-label={`Editar título da coluna: ${column.title}`}
								>
									{column.title}
								</button>
							)}
							<div className="flex items-center gap-2">
								{!isFirstColumn && onDeleteColumn && (
									<button
										type="button"
										onClick={() => onDeleteColumn(column.id)}
										className="text-red-500 hover:text-red-700"
										aria-label={`Excluir coluna: ${column.title}`}
									>
										<X className="w-4 h-4 cursor-pointer" />
									</button>
								)}
								<Checkbox
									className="cursor-pointer"
									checked={currentColumn.save}
									onCheckedChange={() => toggleColumnSave(column.id)}
									aria-label="Salvar coluna"
								/>
							</div>
						</div>
					</div>
					<div className="flex-grow overflow-y-auto max-h-[calc(100vh-200px)] p-2">
						{column.items.map((item, index) => (
							<ImageCard
								key={item.id}
								item={item}
								index={index}
								columnId={column.id}
								onRemove={onRemoveImage}
								onRotate={onRotateImage}
							/>
						))}
						{provided.placeholder}
					</div>
				</div>
			)}
		</Droppable>
	);
}
