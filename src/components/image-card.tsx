import { Draggable } from "@hello-pangea/dnd";
import { Info, RotateCw, X } from "lucide-react";
import { useState } from "react";
import { ImageInfoModal } from "@/components/image-info-modal";
import { Card, CardContent } from "@/components/ui/card";
import type { ImageCardProps } from "@/types/image-card";
import { Button } from "./ui/button";

export function ImageCard({
	item,
	index,
	columnId,
	onRemove,
	onRotate,
}: ImageCardProps) {
	const [showModal, setShowModal] = useState<boolean>(false);

	const handleRotate = (): void => {
		const newRotation = (item.rotation + 90) % 360;
		onRotate(columnId, item.id, newRotation);
	};

	const handleImageError = (_e: React.SyntheticEvent<HTMLImageElement>) => {
		console.error("Error loading image:", item.src);
	};

	return (
		<Draggable draggableId={item.id} index={index}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className="mb-2"
				>
					<Card className="cursor-pointer relative w-full overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
						<div
							className="
                absolute top-0 left-0 w-full flex justify-center gap-2 py-2
                bg-gradient-to-b from-black/70 to-transparent opacity-0 group-hover:opacity-100
                transition-opacity duration-300 z-10
              "
						>
							<Button
								type="button"
								onClick={() => onRemove(columnId, item.id)}
								className="
                  p-2 rounded-full cursor-pointer bg-white/90 dark:bg-gray-800/90
                  text-gray-900 dark:text-gray-100 hover:bg-red-500 hover:text-white
                  transition-all duration-200 shadow-md
                "
								aria-label="Remover imagem"
							>
								<X className="w-4 h-4" />
							</Button>

							<Button
								type="button"
								onClick={handleRotate}
								className="
                  p-2 rounded-full cursor-pointer bg-white/90 dark:bg-gray-800/90
                  text-gray-900 dark:text-gray-100 hover:bg-blue-500 hover:text-white
                  transition-all duration-200 shadow-md
                "
								aria-label="Rotacionar imagem"
							>
								<RotateCw className="w-4 h-4" />
							</Button>

							<Button
								type="button"
								onClick={() => setShowModal(true)}
								className="
                p-2 rounded-full cursor-pointer bg-white/90 dark:bg-gray-800/90
                text-gray-900 dark:text-gray-100 hover:bg-green-500 hover:text-white
                transition-all duration-200 shadow-md
              "
								aria-label="Inspecionar imagem"
							>
								<Info className="w-4 h-4" />
							</Button>
						</div>

						<CardContent className="p-0">
							<img
								src={item.src}
								alt={item.fileName}
								onError={handleImageError}
								style={{ transform: `rotate(${item.rotation}deg)` }}
								className="
                  w-full h-48 object-cover
                  transition-transform duration-500 ease-in-out
                "
							/>
						</CardContent>

						{showModal && (
							<ImageInfoModal item={item} onClose={() => setShowModal(false)} />
						)}
					</Card>
				</div>
			)}
		</Draggable>
	);
}
