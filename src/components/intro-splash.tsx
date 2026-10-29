import { useEffect, useState } from "react";

const SEEN_KEY = "anf.introVista";

/**
 * Abertura do onboarding: tela azul com o logo e "Aposta no Futuro",
 * que some sozinha em ~1,6 s. Mostrada uma vez por sessão.
 */
export function IntroSplash() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    if (seen) {
      setShow(false);
      return;
    }
    const id = window.setTimeout(() => setShow(false), 1700);
    return () => window.clearTimeout(id);
  }, []);

  if (!show) return null;

  return (
    <div
      className="intro-splash fixed inset-0 z-[110] flex flex-col items-center justify-center gap-5 bg-[#16233C] px-6"
      aria-hidden="true"
    >
      <img
        src="/logo-maos-coracao.svg"
        alt=""
        width={96}
        height={96}
        className="intro-splash-logo h-24 w-24 select-none"
        draggable={false}
      />
      <p className="intro-splash-text text-center text-3xl font-bold tracking-tight text-white">
        Aposta no <span className="text-[#0AF0FB]">Futuro</span>
      </p>
    </div>
  );
}
