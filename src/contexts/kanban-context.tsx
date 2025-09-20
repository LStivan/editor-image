import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { blobToBase64 } from "@/lib/utils";
import { saveImage } from "@/services/tauri-service";
import type { Column, ImageItem } from "@/types/kanban";

interface KanbanContextType {
	columns: Column[];
	areAllColumnsSaved: boolean;
	loadFromStorage: () => void;
	addColumn: () => void;
	removeColumn: (columnId: string) => void;
	updateColumnTitle: (columnId: string, title: string) => void;
	toggleColumnSave: (columnId: string) => void;
	toggleAllColumnsSave: (shouldSave: boolean) => void;
	addImagesToFirstColumn: (images: ImageItem[]) => void;
	removeImage: (columnId: string, imageId: string) => void;
	rotateImage: (columnId: string, imageId: string, rotation: number) => void;
	moveImageBetweenColumns: (
		sourceColumnId: string,
		sourceIndex: number,
		destColumnId: string,
		destIndex: number,
	) => void;
}

export const KanbanContext = createContext<KanbanContextType | null>(null);

export function KanbanProvider({ children }: { children: React.ReactNode }) {
	const [columns, setColumns] = useState<Column[]>([
		{
			id: "pdf-1",
			title: "PDF 1",
			items: [],
			save: false,
		},
	]);

	const loadFromStorage = useCallback(() => {
		const savedColumns = localStorage.getItem("kanban-columns");
		if (savedColumns) {
			try {
				const parsedColumns = JSON.parse(savedColumns);
				setColumns(parsedColumns);
			} catch (e) {
				console.error("Failed to parse saved columns", e);
			}
		} else {
			setColumns([
				{
					id: "pdf-1",
					title: "PDF 1",
					items: [],
					save: false,
				},
			]);
		}
	}, []);

	const saveToStorage = useCallback((cols: Column[]) => {
		localStorage.setItem("kanban-columns", JSON.stringify(cols));
	}, []);

	useEffect(() => {
		loadFromStorage();
	}, [loadFromStorage]);

	const addColumn = useCallback(() => {
		setColumns((prev) => {
			const pdfColumns = prev.filter((col) => col.title.startsWith("PDF "));
			const nextNumber =
				pdfColumns.length > 0
					? Math.max(
							...pdfColumns.map((col) =>
								parseInt(col.title.split(" ")[1] || "1", 10),
							),
						) + 1
					: 1;

			const newColumn: Column = {
				id: `pdf-${Date.now()}`,
				title: `PDF ${nextNumber}`,
				items: [],
				save: false,
			};
			const newColumns = [...prev, newColumn];
			saveToStorage(newColumns);
			return newColumns;
		});
	}, [saveToStorage]);

	const removeColumn = useCallback(
		(columnId: string) => {
			setColumns((prev) => {
				if (prev.length <= 1 || prev[0].id === columnId) {
					return prev;
				}

				const newColumns = prev.filter((col) => col.id !== columnId);
				saveToStorage(newColumns);
				return newColumns;
			});
		},
		[saveToStorage],
	);

	const updateColumnTitle = useCallback(
		(columnId: string, title: string) => {
			setColumns((prev) => {
				const newColumns = prev.map((col) =>
					col.id === columnId ? { ...col, title } : col,
				);
				saveToStorage(newColumns);
				return newColumns;
			});
		},
		[saveToStorage],
	);

	const toggleColumnSave = useCallback(
		(columnId: string) => {
			setColumns((prev) => {
				const newColumns = prev.map((col) =>
					col.id === columnId ? { ...col, save: !col.save } : col,
				);
				saveToStorage(newColumns);
				return newColumns;
			});
		},
		[saveToStorage],
	);

	const toggleAllColumnsSave = useCallback(
		(shouldSave: boolean) => {
			setColumns((prev) => {
				const newColumns = prev.map((col) => ({ ...col, save: shouldSave }));
				saveToStorage(newColumns);
				return newColumns;
			});
		},
		[saveToStorage],
	);

	const areAllColumnsSaved = useMemo(() => {
		return columns.length > 0 && columns.every((col) => col.save);
	}, [columns]);

	const addImagesToFirstColumn = useCallback(
		(images: ImageItem[]) => {
			setColumns((prev) => {
				if (prev.length === 0) return prev;

				const firstColumn = {
					...prev[0],
					items: [...images.map((img) => ({ ...img })), ...prev[0].items],
				};

				const newColumns = [firstColumn, ...prev.slice(1)];

				saveToStorage(newColumns);
				return newColumns;
			});
		},
		[saveToStorage],
	);

	const removeImage = useCallback(
		(columnId: string, imageId: string) => {
			setColumns((prev) => {
				const newColumns = prev.map((col) => {
					if (col.id === columnId) {
						const imageToRemove = col.items.find((item) => item.id === imageId);
						if (imageToRemove?.src?.startsWith("blob:")) {
							URL.revokeObjectURL(imageToRemove.src);
						}

						return {
							...col,
							items: col.items.filter((item) => item.id !== imageId),
						};
					}
					return col;
				});
				saveToStorage(newColumns);
				return newColumns;
			});
		},
		[saveToStorage],
	);

	const rotateImage = useCallback(
		(columnId: string, imageId: string, rotation: number) => {
			setColumns((prev) => {
				const newColumns = prev.map((col) => {
					if (col.id === columnId) {
						return {
							...col,
							items: col.items.map((item) =>
								item.id === imageId ? { ...item, rotation } : item,
							),
						};
					}
					return col;
				});
				saveToStorage(newColumns);
				return newColumns;
			});
		},
		[saveToStorage],
	);

	const moveImageBetweenColumns = useCallback(
		(
			sourceColumnId: string,
			sourceIndex: number,
			destColumnId: string,
			destIndex: number,
		) => {
			setColumns((prev) => {
				const sourceColumn = prev.find((col) => col.id === sourceColumnId);
				const destColumn = prev.find((col) => col.id === destColumnId);

				if (!sourceColumn || !destColumn) return prev;

				if (sourceColumnId === destColumnId) {
					const newItems = Array.from(sourceColumn.items);
					const [movedItem] = newItems.splice(sourceIndex, 1);
					newItems.splice(destIndex, 0, movedItem);

					const newColumns = prev.map((col) =>
						col.id === sourceColumnId ? { ...col, items: newItems } : col,
					);
					saveToStorage(newColumns);
					return newColumns;
				} else {
					const sourceItems = Array.from(sourceColumn.items);
					const [movedItem] = sourceItems.splice(sourceIndex, 1);
					const destItems = Array.from(destColumn.items);
					destItems.splice(destIndex, 0, movedItem);

					const newColumns = prev.map((col) => {
						if (col.id === sourceColumnId) {
							return { ...col, items: sourceItems };
						}
						if (col.id === destColumnId) {
							return { ...col, items: destItems };
						}
						return col;
					});
					saveToStorage(newColumns);
					return newColumns;
				}
			});
		},
		[saveToStorage],
	);

	useEffect(() => {
		const saveImagesToFS = async () => {
			for (const column of columns) {
				if (column.save) {
					for (const item of column.items) {
						if (item.filePath) continue;

						if (!item?.src?.startsWith("blob:")) continue;

						try {
							const response = await fetch(item.src);
							const blob = await response.blob();

							const base64 = await blobToBase64(blob);

							const fileName = `${item.id}-${item.fileName}`;

							const filePath = await saveImage(base64, fileName);

							setColumns((prev) => {
								const newColumns = prev.map((col) => {
									if (col.id === column.id) {
										return {
											...col,
											items: col.items.map((i) =>
												i.id === item.id
													? { ...i, filePath, src: `tauri://${filePath}` }
													: i,
											),
										};
									}
									return col;
								});
								return newColumns;
							});
						} catch (error) {
							console.error(`Error saving image ${item.fileName}:`, error);
						}
					}
				}
			}
		};

		saveImagesToFS();
	}, [columns]);

	const contextValue = {
		columns,
		areAllColumnsSaved,
		loadFromStorage,
		addColumn,
		removeColumn,
		updateColumnTitle,
		toggleColumnSave,
		toggleAllColumnsSave,
		addImagesToFirstColumn,
		removeImage,
		rotateImage,
		moveImageBetweenColumns,
	};

	return (
		<KanbanContext.Provider value={contextValue}>
			{children}
		</KanbanContext.Provider>
	);
}

export function useKanbanContext() {
	const ctx = useContext(KanbanContext);
	if (!ctx)
		throw new Error("useKanbanContext must be used inside KanbanProvider");
	return ctx;
}
