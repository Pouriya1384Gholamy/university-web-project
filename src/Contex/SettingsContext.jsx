import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "../../i18n.js";

const SettingsContext = createContext(null);

const read = (key, fallback) => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useState(() => read("theme", "dark")); // "dark" | "light"
  const [lang, setLang] = useState(() => read("lang", "en")); // "en" | "fa"

  const dir = lang === "fa" ? "rtl" : "ltr";

  // اعمال تم و زبان روی کل صفحه + ذخیره در مرورگر
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.lang = lang;
    root.dir = dir;
    document.title = translations[lang].docTitle;
    try {
      localStorage.setItem("theme", theme);
      localStorage.setItem("lang", lang);
    } catch {
      /* مرورگر اجازه‌ی ذخیره نداد؛ مشکلی نیست */
    }
  }, [theme, lang, dir]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  const toggleLang = useCallback(() => setLang((l) => (l === "en" ? "fa" : "en")), []);
  const t = useCallback((key) => translations[lang][key] ?? translations.en[key] ?? key, [lang]);

  const value = useMemo(
    () => ({ theme, lang, dir, isDark: theme === "dark", isRtl: dir === "rtl", toggleTheme, toggleLang, t }),
    [theme, lang, dir, toggleTheme, toggleLang, t]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings باید داخل SettingsProvider استفاده شود");
  return ctx;
}
