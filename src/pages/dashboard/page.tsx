import DragDropPreviewerImage from "./drag-drop-previewer-image";
import Header from "./header";

export default function Dashboard() {
	return (
		<section className="px-4 flex flex-wrap gap-4 flex-col">
			<Header />
			<DragDropPreviewerImage />
		</section>
	);
}
