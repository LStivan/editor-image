import type { ImageItem } from "@/types/kanban";

export interface ImageInfoModalProps {
	item: ImageItem;
	onClose: () => void;
}
