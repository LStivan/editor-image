import React from "react";
import ReactDOM from "react-dom/client";

import "@/index.css";
import App from "@/App";
import { I18nProvider } from "@/providers/i18n-provider";
import { ThemeProvider } from "@/providers/theme-provider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<I18nProvider>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<App />
			</ThemeProvider>
		</I18nProvider>
	</React.StrictMode>,
);
