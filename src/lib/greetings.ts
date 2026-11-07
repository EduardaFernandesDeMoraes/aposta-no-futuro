/**
 * Saudações da home.
 *
 * Mudam a cada visita (ficam estáveis enquanto a aba estiver aberta, para o
 * título não trocar a cada volta à home) e nunca repetem a da visita
 * anterior. O conjunto depende da hora do dia e do momento da pessoa
 * (contador começando, em andamento ou ainda não iniciado).
 *
 * Tom: acolhedor e sóbrio. Nada de euforia, cobrança ou promessa.
 * Sem marcação de gênero ("bem-vindo", "cansado"...).
 */

export type Greeting = {
  key: string;
  /** Início da frase, antes do nome: "Bom dia" → "Bom dia, Lucas." */
  open: string;
  /** Pontuação que fecha a primeira parte ("." ou "?"). */
  close: "." | "?";
  /** Segunda frase, mais leve. */
  rest: string;
};

const G = (key: string, open: string, close: "." | "?", rest: string): Greeting => ({
  key,
  open,
  close,
  rest,
});

function byTimeOfDay(hour: number): Greeting {
  if (hour < 5) return G("madrugada", "Ainda por aqui", "?", "A gente fica com você.");
  if (hour < 12) return G("manha", "Bom dia", ".", "Um dia de cada vez.");
  if (hour < 18) return G("tarde", "Boa tarde", ".", "Como está o seu dia?");
  return G("noite", "Boa noite", ".", "Você chegou até aqui.");
}

const GENERAL: Greeting[] = [
  G("oi-hoje", "Oi", ".", "Como você está hoje?"),
  G("bom-te-ver", "Que bom te ver", ".", "Sem pressa por aqui."),
  G("respira", "Respira", ".", "Você está no seu tempo."),
  G("visita", "Oi", ".", "Voltar aqui já é cuidado."),
];

function byMoment(started: boolean, days: number): Greeting[] {
  if (!started) return [G("comeca", "Oi", ".", "Comece quando quiser.")];
  if (days === 0) return [G("primeiro-dia", "Primeiro dia", ".", "Começar já é coragem.")];
  return [G("mais-um-dia", "Mais um dia", ".", "Cada dia soma.")];
}

const SESSION_KEY = "anf.saudacao.visita";
const LAST_KEY = "anf.saudacao.ultima";

function safeGet(store: Storage | undefined, key: string) {
  try {
    return store?.getItem(key) ?? null;
  } catch {
    return null;
  }
}
function safeSet(store: Storage | undefined, key: string, value: string) {
  try {
    store?.setItem(key, value);
  } catch {
    /* modo privado ou armazenamento bloqueado: segue sem lembrar */
  }
}

/** Só no navegador (usa hora local e armazenamento). */
export function pickGreeting({
  hour,
  started,
  days,
}: {
  hour: number;
  started: boolean;
  days: number;
}): Greeting {
  const pool = [byTimeOfDay(hour), ...byMoment(started, days), ...GENERAL];

  // Mesma visita: mantém a saudação, se ela ainda fizer sentido agora.
  const current = safeGet(window.sessionStorage, SESSION_KEY);
  const kept = pool.find((g) => g.key === current);
  if (kept) return kept;

  // Nova visita: sorteia uma diferente da última.
  const last = safeGet(window.localStorage, LAST_KEY);
  const options = pool.filter((g) => g.key !== last);
  const chosen = options[Math.floor(Math.random() * options.length)] ?? pool[0];
  safeSet(window.sessionStorage, SESSION_KEY, chosen.key);
  safeSet(window.localStorage, LAST_KEY, chosen.key);
  return chosen;
}
