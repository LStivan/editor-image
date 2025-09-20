import type { Column as ColumnType } from "@/types/kanban";

export interface ColumnProps {
	column: ColumnType;
	onRemoveImage: (columnId: string, imageId: string) => void;
	onRotateImage: (columnId: string, imageId: string, rotation: number) => void;
	onDeleteColumn?: (columnId: string) => void;
	isFirstColumn?: boolean;
}
