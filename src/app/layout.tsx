import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "GrowMate — Assistente de Cultivo",
  description: "Seu assistente IA para cultivo de cannabis. Setup, plantas, nutricao e guias personalizados.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GrowMate",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#29b554",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var t = localStorage.getItem('growmate-theme');
                if (t === 'light') document.documentElement.classList.remove('dark');
                else document.documentElement.classList.add('dark');
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "rgb(var(--color-surface))",
                border: "1px solid rgb(var(--color-border-strong))",
                color: "rgb(var(--color-text))",
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize: "0.8125rem",
              },
            }}
            gap={8}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
