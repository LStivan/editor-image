import { X } from "lucide-react";
import { useEffect, useState } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { ImageInfoModalProps } from "@/types/image-info-modal";

export function ImageInfoModal({ item, onClose }: ImageInfoModalProps) {
	const [imageInfo, setImageInfo] = useState({
		width: 0,
		height: 0,
		size: 0,
		type: "",
		lastModified: "",
	});

	useEffect(() => {
		const img = new Image();
		img.onload = () => {
			setImageInfo((prev) => ({
				...prev,
				width: img.naturalWidth,
				height: img.naturalHeight,
			}));
		};
		img.src = item.src;

		if (item.size) {
			setImageInfo((prev) => ({ ...prev, size: item.size || 0 }));
		}

		if (item.filePath) {
			setImageInfo((prev) => ({
				...prev,
				lastModified: new Date().toLocaleDateString(),
			}));
		}
	}, [item]);

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
	};

	const getFileExtension = (fileName: string): string => {
		return fileName.split(".").pop()?.toUpperCase() || "UNKNOWN";
	};

	return (
		<Dialog open onOpenChange={onClose}>
			<DialogContent
				className="w-[95vw] max-w-3xl rounded-xl p-6 sm:p-8"
				showCloseButton={false}
			>
				<DialogHeader className="mb-6">
					<DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 select-none">
						Informações da Imagem
					</DialogTitle>
					<DialogClose
						className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 absolute top-4 right-4"
						aria-label="Fechar"
					>
						<X className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer" />
					</DialogClose>
				</DialogHeader>

				<div className="flex flex-col md:flex-row md:items-start gap-8">
					<div className="md:w-2/3 w-full">
						<img
							src={item.src}
							alt={`Preview de ${item.fileName}`}
							className="w-full h-auto rounded-lg border border-gray-300 dark:border-gray-700 shadow-md"
						/>
					</div>

					<div className="md:w-1/3 w-full">
						<div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-base">
							<h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-lg select-none">
								Detalhes
							</h3>
							<ul className="space-y-3 text-gray-700 dark:text-gray-300 break-words">
								<li>
									<p className="font-semibold select-none">Nome:</p>
									<p className="font-mono text-sm break-all">{item.fileName}</p>
								</li>
								<li>
									<p className="font-semibold select-none">Formato:</p>
									<p className="font-mono text-sm break-all">
										{getFileExtension(item.fileName)}
									</p>
								</li>
								<li>
									<p className="font-semibold select-none">Dimensões:</p>
									<p className="font-mono text-sm break-all">
										{imageInfo.width}×{imageInfo.height}
									</p>
								</li>
								<li>
									<p className="font-semibold select-none">Tamanho:</p>
									<p className="font-mono text-sm break-all">
										{formatFileSize(imageInfo.size)}
									</p>
								</li>
								<li>
									<p className="font-semibold select-none">Rotação:</p>
									<p className="font-mono text-sm break-all">
										{item.rotation}°
									</p>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
