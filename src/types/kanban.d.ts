export interface ImageItem {
	id: string;
	src: string;
	fileName: string;
	rotation: number;
	width?: number;
	height?: number;
	size?: number;
	filePath?: string;
}

export interface Column {
	id: string;
	title: string;
	items: ImageItem[];
	save: boolean;
}
