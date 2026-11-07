/**
 * Transição entre AF People e AF Campus.
 *
 * Uma cortina azul-escura sobe e cobre a tela; dentro dela a assinatura
 * "AF People" vira "AF Campus" (a palavra antiga sai por cima, a nova entra
 * por baixo); a rota troca enquanto a tela está coberta; a cortina segue
 * subindo e revela o outro produto. Na volta (Campus → People) o movimento
 * é espelhado: a cortina desce.
 *
 * O elemento vive direto no <body> para sobreviver à troca de rota.
 * Quem pede menos movimento recebe só um fade curto, sem deslocamentos.
 */

type Product = "People" | "Campus";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const EASE_IN_OUT = "cubic-bezier(0.77, 0, 0.175, 1)";
const EASE_DRAWER = "cubic-bezier(0.32, 0.72, 0, 1)";

let running = false;

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

/** Um quadro, mas nunca mais de 50ms (abas em segundo plano congelam o rAF). */
const nextFrame = () =>
  Promise.race([new Promise<void>((r) => requestAnimationFrame(() => r())), wait(50)]);

/**
 * Espera a animação terminar, com teto de tempo: se o navegador pausar a
 * linha do tempo (aba escondida), a sequência segue mesmo assim.
 */
function done(anim: Animation) {
  const timing = anim.effect?.getComputedTiming();
  const total = Number(timing?.endTime ?? 600);
  return Promise.race([anim.finished.then(() => undefined, () => undefined), wait(total + 250)]);
}

function build(from: Product, to: Product) {
  const root = document.createElement("div");
  root.className = "af-switch";
  root.setAttribute("aria-hidden", "true");
  root.innerHTML = `
    <div class="af-switch-lockup">
      <img class="af-switch-logo" src="/logo-af-splash.webp" alt="" draggable="false" />
      <span class="af-switch-af">AF</span>
      <span class="af-switch-words">
        <span class="af-switch-word" data-w="from">${from}</span>
        <span class="af-switch-word" data-w="to">${to}</span>
      </span>
    </div>`;
  document.body.appendChild(root);
  return {
    root,
    lockup: root.querySelector<HTMLElement>(".af-switch-lockup")!,
    fromWord: root.querySelector<HTMLElement>('[data-w="from"]')!,
    toWord: root.querySelector<HTMLElement>('[data-w="to"]')!,
  };
}

/** Anuncia a troca para leitores de tela (o overlay em si é decorativo). */
function announce(to: Product) {
  const live = document.createElement("div");
  live.setAttribute("role", "status");
  live.className = "sr-only";
  live.textContent = `Abrindo AF ${to}`;
  document.body.appendChild(live);
  window.setTimeout(() => live.remove(), 2500);
}

export async function playProductSwitch(to: Product, go: () => unknown) {
  if (running) return;
  if (typeof window === "undefined" || typeof document.body.animate !== "function") {
    await go();
    return;
  }
  running = true;
  const from: Product = to === "Campus" ? "People" : "Campus";
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  announce(to);

  const { root, lockup, fromWord, toWord } = build(from, to);
  let navigated = false;
  const navigate = async () => {
    if (navigated) return;
    navigated = true;
    await go();
  };
  const failsafe = window.setTimeout(() => {
    void navigate();
    root.remove();
    running = false;
  }, 4000);
  const opts = { fill: "forwards" as const };

  try {
    if (reduce) {
      toWord.style.opacity = "0";
      await done(root.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: "ease-out", ...opts }));
      fromWord.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: "ease-out", ...opts });
      await done(toWord.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "ease-out", ...opts }));
      await navigate();
      await nextFrame();
      await wait(250);
      await done(root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: "ease-out", ...opts }));
      return;
    }

    // Para o Campus a cortina sobe (entra por baixo); de volta, desce.
    const up = to === "Campus";
    const hiddenStart = up ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)";
    const hiddenEnd = up ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)";
    const shown = "inset(0 0 0 0)";
    const enterY = up ? "110%" : "-110%";
    const exitY = up ? "-110%" : "110%";

    toWord.style.transform = `translateY(${enterY})`;
    toWord.style.opacity = "0";

    // 1. Cortina cobre a tela; a assinatura chega junto.
    const cover = root.animate([{ clipPath: hiddenStart }, { clipPath: shown }], {
      duration: 520,
      easing: EASE_DRAWER,
      ...opts,
    });
    lockup.animate(
      [
        { opacity: 0, transform: `translateY(${up ? 24 : -24}px)` },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 480, delay: 140, easing: EASE_OUT, ...opts },
    );
    await done(cover);
    await wait(60);

    // 2. A palavra troca: People sai, Campus entra.
    fromWord.animate(
      [
        { transform: "translateY(0)", opacity: 1 },
        { transform: `translateY(${exitY})`, opacity: 0 },
      ],
      { duration: 300, easing: EASE_IN_OUT, ...opts },
    );
    const swapIn = toWord.animate(
      [
        { transform: `translateY(${enterY})`, opacity: 0 },
        { transform: "translateY(0)", opacity: 1 },
      ],
      { duration: 420, delay: 70, easing: EASE_OUT, ...opts },
    );
    await done(swapIn);

    // 3. Troca a rota com a tela coberta e espera o novo conteúdo desenhar.
    await navigate();
    await nextFrame();
    await nextFrame();
    await wait(100);

    // 4. A cortina continua o movimento e revela o outro produto.
    lockup.animate(
      [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: `translateY(${up ? -16 : 16}px)` },
      ],
      { duration: 260, easing: EASE_OUT, ...opts },
    );
    await done(root.animate([{ clipPath: shown }, { clipPath: hiddenEnd }], {
      duration: 500,
      easing: EASE_DRAWER,
      ...opts,
    }));
  } finally {
    window.clearTimeout(failsafe);
    await navigate();
    root.remove();
    running = false;
  }
}
