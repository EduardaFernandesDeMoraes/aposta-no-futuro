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
      className="flex min-h-dvh w-full items-center justify-center bg-[#16233C] px-6"
      aria-busy="true"
    >
      <p className="text-center text-2xl font-semibold tracking-tight text-white">
        Aposta no Futuro
      </p>
    </div>
  );
}

/**
 * Renders a neutral splash (identical on server and client) until the
 * onboarding flag in localStorage is read — on the very first client
 * effect, before any content paint. No artificial delay.
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

  if (allowed !== true) return <Splash />;
  return <>{children}</>;
}
