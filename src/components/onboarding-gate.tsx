import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

function readOnboarded(): boolean {
  try {
    const raw = window.localStorage.getItem("anf.profile");
    if (!raw) return false;
    return Boolean(JSON.parse(raw)?.onboarded);
  } catch {
    return false;
  }
}

function Splash() {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#16233C] px-6"
      aria-hidden="true"
    >
      <p className="text-center text-2xl font-semibold tracking-tight text-white">
        Aposta no Futuro
      </p>
    </div>
  );
}

/**
 * The real content is ALWAYS rendered (server and client), so crawlers and
 * visitors without JavaScript get the full page with HTTP 200 — never a
 * server-side redirect. Only after hydration, on the client, a neutral
 * splash overlay covers it while the onboarding flag is read from
 * localStorage and, if needed, the user is navigated to the right route.
 */
export function OnboardingGate({
  expect,
  children,
}: {
  expect: "onboarded" | "new";
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const onboarded = readOnboarded();
    const ok = expect === "onboarded" ? onboarded : !onboarded;
    if (ok) {
      setAllowed(true);
    } else {
      setAllowed(false);
      navigate({ to: expect === "onboarded" ? "/bem-vindo" : "/", replace: true });
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {children}
      {allowed !== true ? <Splash /> : null}
    </>
  );
}
