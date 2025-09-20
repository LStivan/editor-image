import { invoke } from "@tauri-apps/api/core";

export async function saveImage(
	imageData: string,
	fileName: string,
): Promise<string> {
	try {
		const result = await invoke<string>("save_image", {
			imageData,
			fileName,
		});
		return result;
	} catch (error) {
		console.error("Error saving image:", error);
		throw error;
	}
}

export async function loadImage(filePath: string): Promise<string> {
	try {
		const result = await invoke<string>("load_image", {
			filePath,
		});
		return result;
	} catch (error) {
		console.error("Error loading image:", error);
		throw error;
	}
}
