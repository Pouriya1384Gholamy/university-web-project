import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Sun, Moon, Languages, Menu, X, Sparkles } from "lucide-react";
import { useSettings } from "../Contex/SettingsContext.jsx";

const links = [
  { to: "/", key: "home" },
  { to: "/about", key: "about" },
  { to: "/skills", key: "skills" },
  { to: "/projects", key: "projects" },
];

/* ------------------ Magnetic ------------------ */
function Magnetic({ children, strength = 12 }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * strength;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0, 0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="inline-flex transition-transform duration-200 ease-out will-change-transform"
    >
      {children}
    </div>
  );
}

/* ------------------ Desktop Link ------------------ */
function DesktopLink({ to, label }) {
  return (
    <NavLink to={to} end className="relative group">
      {({ isActive }) => (
        <span
          className={`relative z-10 inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
            isActive ? "text-porto-fg" : "text-porto-text group-hover:text-porto-fg"
          }`}
        >
          {label}
          {isActive && (
            <motion.span
              layoutId="nav-pill"
              className="absolute inset-0 -z-10 rounded-full bg-porto-fg/10 border border-porto-fg/10"
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            />
          )}
        </span>
      )}
    </NavLink>
  );
}

export default function Header() {
  const { t, isDark, toggleTheme, toggleLang } = useSettings();
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);

  // Spotlight دنبال‌کننده موس
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };

    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, []);

  // قفل اسکرول هنگام باز بودن منوی موبایل
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        ref={headerRef}
        className="header-glass fixed top-0 inset-x-0 z-50"
      >
        {/* نور دنبال‌کننده */}
        <div className="header-spotlight" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-3.5">
          {/* لوگو */}
          <Magnetic strength={10}>
            <Link
              to="/"
              className="logo group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-lg text-black"
              aria-label={t("home")}
            >
              <span className="logo-ring" aria-hidden="true" />
              <span className="relative z-10 tracking-tight">PG</span>
            </Link>
          </Magnetic>

          {/* منوی دسکتاپ */}
          <nav className="nav-pill hidden md:flex items-center gap-0.5 px-1.5 py-1">
            {links.map((l) => (
              <DesktopLink key={l.to} to={l.to} label={t(l.key)} />
            ))}
          </nav>

          {/* دکمه‌های سمت راست */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Magnetic strength={8}>
              <button
                onClick={toggleLang}
                aria-label={t("langAria")}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm text-porto-text transition-colors hover:bg-porto-fg/5 hover:text-porto-fg"
              >
                <Languages size={17} strokeWidth={1.8} />
                <span className="hidden sm:inline font-medium">{t("langLabel")}</span>
              </button>
            </Magnetic>

            <Magnetic strength={8}>
              <button
                onClick={toggleTheme}
                aria-label={isDark ? t("toLight") : t("toDark")}
                className="grid h-9 w-9 place-items-center rounded-full text-porto-text transition-colors hover:bg-porto-fg/5 hover:text-porto-fg"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isDark ? "sun" : "moon"}
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.22 }}
                    className="grid place-items-center"
                  >
                    {isDark ? <Sun size={17} strokeWidth={1.8} /> : <Moon size={17} strokeWidth={1.8} />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </Magnetic>

            {/* CTA */}
            <Magnetic strength={11}>
              <button className="cta-btn group relative hidden items-center gap-2 rounded-full bg-porto-gold px-5 py-2 font-semibold text-black transition-all hover:bg-porto-gold-hover sm:flex">
                <span className="cta-sheen" aria-hidden="true" />
                <Sparkles size={15} className="relative z-10" />
                <span className="relative z-10">{t("talk")}</span>
              </button>
            </Magnetic>

            {/* همبرگر */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t("closeMenu") : t("openMenu")}
              aria-expanded={open}
              className="grid h-9 w-9 place-items-center rounded-full text-porto-text transition-colors hover:bg-porto-fg/5 hover:text-porto-fg md:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "x" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="grid place-items-center"
                >
                  {open ? <X size={20} /> : <Menu size={20} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* منوی موبایل */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="mobile-menu overflow-hidden border-t border-porto-fg/5 md:hidden"
            >
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
                  },
                }}
                className="flex flex-col gap-1 p-4"
              >
                {links.map((l) => (
                  <motion.div
                    key={l.to}
                    variants={{
                      hidden: { opacity: 0, x: -16 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <NavLink
                      to={l.to}
                      end
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-porto-gold/12 text-porto-fg"
                            : "text-porto-text hover:bg-porto-fg/5 hover:text-porto-fg"
                        }`
                      }
                    >
                      <span>{t(l.key)}</span>
                      <span className="text-porto-gold/50">→</span>
                    </NavLink>
                  </motion.div>
                ))}

                <motion.button
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  onClick={() => setOpen(false)}
                  className="cta-btn mt-3 flex items-center justify-center gap-2 rounded-full bg-porto-gold px-6 py-3.5 font-semibold text-black sm:hidden"
                >
                  <Sparkles size={16} />
                  {t("talk")}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Backdrop موبایل */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[6px] md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}