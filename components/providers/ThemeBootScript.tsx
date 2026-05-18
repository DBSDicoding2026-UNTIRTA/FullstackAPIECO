import type { ThemePreference } from "@/types/settings";

interface ThemeBootScriptProps {
  readonly theme: ThemePreference;
}

export default function ThemeBootScript({ theme }: ThemeBootScriptProps) {
  const code = `
    (function () {
      try {
        var theme = ${JSON.stringify(theme)};
        var resolved = theme === "system"
          ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
          : theme;
        document.documentElement.classList.toggle("dark", resolved === "dark");
        document.documentElement.dataset.theme = resolved;
        document.documentElement.dataset.themePreference = theme;
        document.documentElement.style.colorScheme = resolved;
      } catch (_) {}
    })();
  `;

  return <script id="theme-boot-script" dangerouslySetInnerHTML={{ __html: code }} />;
}

