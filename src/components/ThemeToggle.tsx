// src/components/ThemeToggle.tsx
import React from "react";
import { Moon, Sun } from "lucide-react";
import { createPortal } from "react-dom";

export function ThemeToggle({
  theme,
  setTheme,
}: {
  theme: "dark" | "light";
  setTheme: React.Dispatch<React.SetStateAction<"dark" | "light">>;
}) {
  return createPortal(
    <button
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      className="btn"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        boxShadow: "0 18px 50px color-mix(in srgb, var(--shadow) 35%, transparent)",
        marginBottom: "env(safe-area-inset-bottom)",
        marginRight: "env(safe-area-inset-right)",
      }}
      title={theme === "dark" ? "Mudar para Light" : "Mudar para Dark"}
    >
      {theme === "dark" ? <Moon size={15} /> : <Sun size={15} />}
      {theme === "dark" ? "DARK" : "LIGHT"}
    </button>,
    document.body
  );
}
