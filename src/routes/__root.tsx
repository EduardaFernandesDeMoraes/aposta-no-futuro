import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { UMAMI_SRC, UMAMI_WEBSITE_ID } from "../lib/analytics";
// Captura o evento de instalação assim que o app carrega (global, não por tela).
import "../lib/install-prompt";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="max-w-sm text-center">
        <img
          src="/logo-maos-coracao.svg"
          alt=""
          aria-hidden="true"
          width={64}
          height={64}
          className="mx-auto h-16 w-16 select-none"
        />
        <h1 className="mt-6 text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] text-navy">
          Essa página não existe
        </h1>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
          O endereço pode ter mudado ou estar com um errinho de digitação. Seu
          progresso continua salvo no aparelho.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Link
            to="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-teal-deep px-5 text-sm font-semibold text-white transition-colors hover:bg-teal-ink"
          >
            Voltar para o início
          </Link>
          <Link
            to="/ajuda"
            className="inline-flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-semibold text-coral-deep transition-colors hover:bg-coral-soft"
          >
            Preciso de ajuda agora
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="max-w-sm text-center">
        <img
          src="/logo-maos-coracao.svg"
          alt=""
          aria-hidden="true"
          width={64}
          height={64}
          className="mx-auto h-16 w-16 select-none"
        />
        <h1 className="mt-6 text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] text-navy">
          Algo não carregou direito
        </h1>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
          O erro foi do nosso lado, não seu. Tente de novo; seu progresso
          continua salvo no aparelho.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-teal-deep px-5 text-sm font-semibold text-white transition-colors hover:bg-teal-ink"
          >
            Tentar de novo
          </button>
          <a
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-semibold text-navy transition-colors hover:bg-muted"
          >
            Voltar para o início
          </a>
          <a
            href="tel:188"
            className="inline-flex min-h-11 items-center justify-center text-sm font-medium text-coral-deep underline underline-offset-4"
          >
            Em crise? Ligue 188 (CVV)
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#16233C" },
      { name: "apple-mobile-web-app-title", content: "Aposta no Futuro" },

      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Aposta no Futuro" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "google-site-verification", content: "Ghk-5vMeH5Ab2WkVY3PV1DwF3ccxtZmYyP271QYX94s" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon-96x96.png", sizes: "96x96" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },

      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Poppins:wght@400;500;600;700;800&display=swap",
      },
    ],
    scripts: [
      ...(UMAMI_WEBSITE_ID
        ? [{ src: UMAMI_SRC, defer: true, "data-website-id": UMAMI_WEBSITE_ID }]
        : []),
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Aposta no Futuro",
          url: "https://apostanofuturo.online",
          logo: "https://apostanofuturo.online/web-app-manifest-512x512.png",
          description:
            "App social e educativo para jovens prevenirem e enfrentarem o vício em apostas online.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Aposta no Futuro",
          url: "https://apostanofuturo.online",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
