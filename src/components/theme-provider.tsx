"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "signalpost-theme";

const ThemeContext = createContext<{ theme: Theme; setTheme: (theme: Theme) => void; resolved: "light" | "dark" }>({
  theme: "system",
  setTheme: () => {},
  resolved: "light",
});

export const themeScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}')||'system';var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var d=t==='dark'||(t==='system'&&m);document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  const apply = useCallback((next: Theme) => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = next === "dark" || (next === "system" && prefersDark);
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    setResolved(dark ? "dark" : "light");
  }, []);

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system";
    setThemeState(stored);
    apply(stored);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if ((localStorage.getItem(STORAGE_KEY) as Theme | null) === "system") apply("system");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [apply]);

  const setTheme = useCallback(
    (next: Theme) => {
      localStorage.setItem(STORAGE_KEY, next);
      setThemeState(next);
      apply(next);
    },
    [apply],
  );

  const value = useMemo(() => ({ theme, setTheme, resolved }), [theme, setTheme, resolved]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  const options: { value: Theme; icon: ReactNode; label: string }[] = [
    { value: "light", icon: <Sun size={14} />, label: "Light theme" },
    { value: "dark", icon: <Moon size={14} />, label: "Dark theme" },
    { value: "system", icon: <Monitor size={14} />, label: "System theme" },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg border border-[var(--sp-border)] bg-[var(--sp-surface)] p-0.5",
        compact && "scale-[0.95]",
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={theme === option.value}
          aria-label={option.label}
          title={option.label}
          onClick={() => setTheme(option.value)}
          className={cn(
            "inline-flex h-6.5 w-7 items-center justify-center rounded-[6px] py-1 transition-colors duration-150",
            theme === option.value
              ? "bg-[var(--sp-surface-3)] text-[var(--sp-text)]"
              : "text-[var(--sp-text-subtle)] hover:text-[var(--sp-text)]",
          )}
        >
          {option.icon}
        </button>
      ))}
    </div>
  );
}
