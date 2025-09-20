import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { useCallback, useEffect } from "react";
import { BtnCreateColumn } from "@/components/btn-create-column";
import { ColumnComponent } from "@/components/column";
import { useKanbanContext } from "@/contexts/kanban-context";

export function Board() {
	const {
		columns,
		loadFromStorage,
		addColumn,
		removeColumn,
		removeImage,
		rotateImage,
		moveImageBetweenColumns,
	} = useKanbanContext();

	useEffect(() => {
		loadFromStorage();
	}, [loadFromStorage]);

	const onDragEnd = useCallback(
		(result: DropResult) => {
			const { source, destination } = result;

			if (!destination) return;

			if (
				source.droppableId === destination.droppableId &&
				source.index === destination.index
			) {
				return;
			}

			moveImageBetweenColumns(
				source.droppableId,
				source.index,
				destination.droppableId,
				destination.index,
			);
		},
		[moveImageBetweenColumns],
	);

	const deleteColumn = useCallback(
		(columnId: string) => {
			if (columns.length <= 1 || columns[0].id === columnId) {
				return;
			}

			removeColumn(columnId);
		},
		[columns, removeColumn],
	);

	return (
		<div className="flex flex-col h-full">
			<DragDropContext onDragEnd={onDragEnd}>
				<div className="flex overflow-x-auto gap-4 p-4 flex-grow">
					{columns.map((column, index) => (
						<ColumnComponent
							key={column.id}
							column={column}
							onRemoveImage={removeImage}
							onRotateImage={rotateImage}
							onDeleteColumn={deleteColumn}
							isFirstColumn={index === 0}
						/>
					))}
				</div>
			</DragDropContext>
			<BtnCreateColumn onClick={addColumn} />
		</div>
	);
}
