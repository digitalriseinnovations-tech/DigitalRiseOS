import type { Metadata } from "next";
import { ThemeProvider, themeInitScript } from "@ui/theme";
import "@ui/tokens.css";

export const metadata: Metadata = {
  title: "Digital Rise Daycare OS",
  description: "The operating system for daycare businesses, powered by specialized AI employees.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
