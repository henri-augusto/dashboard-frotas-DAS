import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";
import packageInfo from "../package.json";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Controle de Viaturas DAS",
  description:
    "Plataforma de controle de viaturas do Departamento de Aplicações e Sistemas - DTIC",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const dynamic = "force-dynamic";

const systemVersion = packageInfo.version;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${outfit.variable} ${jetBrainsMono.variable} flex min-h-dvh flex-col antialiased`}
      >
        <a
          href="#conteudo-principal"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Ir para o conteúdo principal
        </a>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        <footer className="mx-auto w-full max-w-5xl shrink-0 px-4 pb-8 pt-4 sm:px-6">
          <div className="grid gap-4 border-t border-border/80 pt-5 text-center text-xs text-muted sm:grid-cols-[1fr_auto] sm:items-end sm:text-left">
            <div className="space-y-1 leading-relaxed">
              <p className="font-medium text-ink-soft">
                SPA (Setor de Políticas e Administração) 
              </p>
              <p>Contato: Ramal 7477 / <a href="mailto:stpa@policiamilitar.sp.gov.br">stapadm@policiamilitar.sp.gov.br</a></p>
            </div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted sm:text-right">
              versão {systemVersion}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
