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

/**
 * Abertura: liga uma vez por visita (sessionStorage), antes do primeiro
 * desenho da página. Nunca aparece em /ajuda: quem está em crise não espera.
 * Um toque ou uma tecla encerram a abertura na hora.
 */
const SPLASH_SCRIPT = `(function(){var d=document.documentElement;try{var p=location.pathname;if(p.indexOf("/ajuda")===0||sessionStorage.getItem("anf.abertura")){d.setAttribute("data-splash","off");return}sessionStorage.setItem("anf.abertura","1");d.setAttribute("data-splash","on");var until=Date.now()+2700;var skip=function(){if(Date.now()<until&&d.getAttribute("data-splash")==="on"){d.setAttribute("data-splash","skip")}};addEventListener("pointerdown",skip,{once:true,capture:true});addEventListener("keydown",skip,{once:true,capture:true})}catch(e){d.setAttribute("data-splash","off")}})();`;

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SPLASH_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        <div id="af-splash" aria-hidden="true">
          <div className="af-splash-stage">
            <SplashMark />
            <p className="af-splash-name">
              <span className="af-splash-name-a">Aposta no</span>{" "}
              <span className="af-splash-name-b">Futuro</span>
            </p>
            <p className="af-splash-tagline">Menos apostas. Mais futuro.</p>
          </div>
        </div>
        {/* Teclado: aparece só no foco e pula o topo direto para o conteúdo. */}
        <a
          href="#conteudo"
          className="fixed left-4 top-3 z-[60] -translate-y-24 rounded-full bg-card px-4 py-3 text-sm font-semibold text-navy shadow-soft transition-transform focus-visible:translate-y-[env(safe-area-inset-top)]"
        >
          Pular para o conteúdo
        </a>
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

/** Logo das mãos com coração, separado em partes para a abertura. */
function SplashMark() {
  return (
    <svg className="af-splash-mark" viewBox="235 232 1574 1584" role="presentation" aria-hidden="true">
      <g className="af-splash-hand af-splash-hand--left"><path fill="#0AF0FB" d="M572.491 319.352C580.212 318.744 587.981 319.369 595.505 321.204C631.731 330.335 655.475 369.039 653.583 405.579C652.692 422.802 645.856 443.185 641.086 459.934L620.791 530.027L575.589 688.208C561.728 735.68 546.405 785.921 533.789 833.475C508.084 836.683 483.932 847.524 464.449 864.596C435.544 889.928 417.823 925.657 415.147 963.998C413.282 992.469 419.486 1020.89 433.046 1045.99C448.318 1074.66 490.918 1121.67 513.793 1148.49C569.377 1213.66 624.444 1280.04 680.591 1344.65C701.853 1333.13 724.218 1318.58 744.776 1305.55C731.787 1291.89 714.475 1270.43 701.701 1255.55L603.722 1140.35L537.218 1062.22C524.034 1046.64 509.121 1030.55 498.422 1013.22C470.317 967.683 500.296 897.688 557.929 900.507C571.225 901.175 583.986 905.949 594.454 914.172C602.844 920.773 619.005 939.781 626.596 948.295L681.29 1009.59L887.939 1241.72C900.094 1254.77 911.153 1268.79 921.003 1283.65C943.04 1317.12 959.717 1353.83 970.429 1392.44C1000.6 1502.76 991.533 1664.49 969.459 1775.71L722.024 1775.22C698.978 1775.22 675.932 1775.37 652.888 1775.67C641.938 1775.76 624.985 1776.3 614.61 1775.43C619.525 1758.5 624.254 1740.56 625.618 1722.92C633.853 1616.47 586.263 1504.59 519.63 1423.45C490.171 1387.58 446.605 1346.39 413.153 1312.77L359.742 1259.03C344.335 1243.5 328.005 1228.41 315.661 1210.37C298.518 1184.91 287.637 1155.76 283.907 1125.29C274.988 1058.01 299.184 1002.54 318.879 940.015L381.527 742.324L460.432 493.617C472.988 454.021 485.146 413.89 498.051 374.389C500.323 367.435 505.311 358.205 509.912 352.501C527.177 331.098 546.054 322.696 572.491 319.352Z" /></g>
      <g className="af-splash-hand af-splash-hand--right"><path fill="#0AF0FB" d="M1395.75 394.507C1399.22 369.896 1409.13 347.856 1429.51 332.654C1445.01 321.095 1464.13 317.324 1483.09 320.264C1506.59 323.908 1528.74 336.835 1542.53 356.44C1553.63 372.23 1574.76 449.968 1582.57 474.596L1672.93 760.853L1730.19 941.193C1738.56 967.39 1755.34 1015.37 1761.01 1040.8C1768.3 1072.71 1768.95 1105.79 1762.92 1137.97C1750.09 1202.83 1722.95 1224.92 1679.01 1268.87L1600.72 1347.06C1582.61 1365.1 1563.77 1382.92 1547.01 1402.17C1506.69 1447.88 1474.41 1500.1 1451.55 1556.61C1439.9 1585.62 1425.65 1633.29 1424.3 1664.59C1427.69 1679.05 1421.94 1696.51 1424.48 1711.5C1425.52 1717.63 1425.73 1727.24 1424.28 1733.33C1425.17 1745.72 1430.32 1763.33 1433.57 1775.68L1079.47 1775.78C1070.9 1733.24 1063.87 1678.56 1060.94 1635.62C1051.69 1500.16 1061.42 1354.97 1154.64 1247.93C1217.53 1177.07 1280.79 1106.54 1344.41 1036.33C1368.67 1008.9 1393.09 981.614 1417.67 954.466C1430.8 939.97 1444.85 923.19 1459.63 910.68C1466.34 905.004 1481.73 901.247 1490.53 900.711C1507.44 899.675 1524.05 905.434 1536.69 916.708C1552.83 931.224 1559.86 948.639 1561.03 970.093C1563.09 1007.72 1539.62 1029.84 1517.12 1056.45L1465.59 1117.23L1366.03 1234.45C1346.21 1257.72 1325.31 1283.16 1304.72 1305.55C1326.41 1318.2 1348.18 1331.84 1369.8 1344.77C1422.4 1280.15 1479.38 1214.58 1533.23 1150.7L1575.52 1100.54C1604.56 1066.03 1625.86 1041.21 1632.71 994.623C1638.5 956.701 1629 918.031 1606.29 887.111C1583.7 856.838 1552.46 838.931 1515.24 833.656L1433.21 551.579C1425.19 524.364 1417.32 497.101 1409.62 469.794C1404.52 451.755 1397.9 430.91 1395.7 412.482C1391.74 407.043 1391.62 399.85 1395.75 394.507Z" /><path fill="#16233C" d="M1424.3 1664.59C1427.69 1679.05 1421.94 1696.51 1424.48 1711.5C1425.52 1717.63 1425.73 1727.24 1424.28 1733.33C1421.43 1710.51 1421.43 1687.41 1424.3 1664.59Z" /><path fill="#16233C" d="M1395.7 412.482C1391.74 407.043 1391.62 399.85 1395.75 394.507C1395.24 401.72 1395.17 405.255 1395.7 412.482Z" /></g>
      <g className="af-splash-heart"><path fill="#FF5B4C" d="M841.777 552.423C859.902 550.924 881.701 553.424 899.206 558.12C959.115 574.192 994.244 606.787 1024.7 658.836C1037.76 636.821 1045.29 623.936 1064.42 605.352C1100.89 569.936 1150.11 550.733 1200.94 552.09C1256.48 553.526 1309.18 577.001 1347.4 617.336C1386.78 658.093 1407.92 713.099 1405.97 769.742C1405.05 807.663 1393.69 844.594 1373.12 876.465C1353.16 907.996 1308.99 946.587 1280.95 973.455L1175.21 1074.76C1125.34 1121.87 1075.32 1172.13 1024.46 1217.82C1003.02 1196.63 978.991 1174.96 957.019 1153.96L792.131 996.516L736.455 943.212C685.634 894.386 651.821 859.24 644.731 784.307C638.918 728.029 656.121 671.792 692.425 628.399C731.92 581.364 781.447 557.899 841.777 552.423Z" /></g>
      <g className="af-splash-spark" style={{ animationDelay: "1180ms" }}><path fill="#0AF0FB" d="M894.749 371.291C923.295 380.732 949.949 394.235 961.207 423.762C971.557 450.906 965.932 470.741 954.841 496.025L942.705 490.89C916.722 480.376 890.875 475.716 863.063 474.519C870.755 444.394 885.11 401.501 894.749 371.291Z" /></g>
      <g className="af-splash-spark" style={{ animationDelay: "1240ms" }}><path fill="#0AF0FB" d="M1150.32 371.945C1152.11 371.528 1151.16 371.483 1153.13 372.423C1156.21 380.117 1158.72 388.624 1161.08 396.601C1168.74 422.451 1177.26 448.431 1183.9 474.554C1154.53 475.968 1133.95 480.496 1106.75 490.521L1090.58 497.634C1088.3 492.391 1086.08 487.126 1083.91 481.839C1073.13 455.209 1075.54 428.726 1093.4 405.759C1107.77 387.294 1129.43 380.35 1150.32 371.945Z" /></g>
      <g className="af-splash-spark" style={{ animationDelay: "1300ms" }}><path fill="#0AF0FB" d="M740.374 276.315C750.975 275.781 759.408 276.112 769.665 279.38C788.366 285.31 803.924 298.465 812.881 315.92C818.754 327.177 821.53 339.792 820.925 352.474C819.983 368.964 808.009 400.326 802.172 417.231C794.603 438.99 787.225 460.813 780.038 482.701C761.5 487.413 751.187 490.621 733.487 497.836C723.611 502.315 713.46 507.736 703.766 512.699C725.5 437.779 750.529 369.116 687.524 305.23C703.559 288.323 716.748 279.483 740.374 276.315Z" /></g>
      <g className="af-splash-spark" style={{ animationDelay: "1360ms" }}><path fill="#0AF0FB" d="M1293.53 276.319C1316.68 272.149 1347.92 286.279 1360.73 305.79C1330.67 334.307 1316.98 379.935 1322.3 420.514C1324.05 433.915 1328.22 448.297 1331.58 461.489L1344.95 513.716C1339 509.766 1333.61 506.917 1327.33 503.529C1310.47 494.889 1287.31 486.352 1268.91 483.293C1257.94 452.133 1248.28 419.296 1236.61 388.243C1223.4 353.097 1222.46 323.978 1251 295.733C1262.54 284.304 1277.5 278.546 1293.53 276.319Z" /></g>
    </svg>
  );
}
