import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FaGithub, FaLinkedin, FaInstagram, FaTelegram } from "react-icons/fa";
import { Link } from "react-router";
import Hero3D from "./Hero3D.jsx";
import HeroAvatar from "./HeroAvatar.jsx";
import { useSettings } from "../Contex/SettingsContext.jsx";

const skills = [
  "React.js",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "Python",
  "Figma",
  "UI / UX",
];

export default function HeroSection() {
  const { t, isRtl } = useSettings();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % skills.length);
    }, 2300);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-[100dvh] flex items-center bg-grid-pattern pt-20 md:pt-16 pb-10 overflow-hidden transition-colors duration-300">
      <div className="hero-glow absolute inset-0 pointer-events-none" />
      <Hero3D />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
        {/* متن */}
        <motion.div
          key={isRtl ? "rtl" : "ltr"}
          className="flex flex-col items-center md:items-start text-center md:text-left rtl:md:text-right order-2 md:order-1 w-full"
          initial={{ opacity: 0, x: isRtl ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Badge */}
          <div className="flex items-center gap-2 bg-porto-fg/5 border border-porto-fg/10 px-3.5 py-1 rounded-full mb-4 md:mb-5">
            <span className="w-2 h-2 rounded-full bg-porto-teal animate-pulse"></span>
            <span className="text-sm font-medium text-porto-text">{t("role")}</span>
          </div>

          <p className="text-base sm:text-lg text-porto-text mb-1.5">{t("hello")}</p>

          {/* Name - slightly smaller to save height */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-5 tracking-tight leading-tight">
            <span className="text-porto-gold">[</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-porto-fg to-porto-text">
              {t("name")}
            </span>
            <span className="text-porto-gold">]</span>
          </h1>

          {/* Bio + Skill rotator */}
          <div className="text-sm sm:text-base text-porto-text max-w-lg mx-auto md:mx-0 mb-6 md:mb-7 leading-relaxed">
            <p className="mb-1">{t("bioLine1")}</p>

            <p className="flex flex-wrap items-center justify-center md:justify-start gap-x-1.5">
              <span>{t("bioBeforeSkill")}</span>

              <span className="relative inline-flex h-[1.5em] min-w-[130px] sm:min-w-[150px] items-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={skills[index]}
                    initial={{ y: 28, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -28, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute font-bold text-porto-gold text-lg sm:text-xl whitespace-nowrap"
                  >
                    {skills[index]}
                  </motion.span>
                </AnimatePresence>

                <span className="invisible font-bold text-lg sm:text-xl">
                  {skills.reduce((a, b) => (a.length > b.length ? a : b))}
                </span>
              </span>

              <span>{t("bioAfterSkill")}</span>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6 md:mb-7 w-full">
            <Link
              to="/projects"
              className="flex items-center justify-center gap-2 bg-porto-gold hover:bg-porto-gold-hover text-black px-6 sm:px-7 py-3 rounded-full font-semibold transition-transform hover:scale-105 text-sm sm:text-base"
            >
              {t("viewProjects")}
              <ArrowUpRight size={18} className="rtl:-scale-x-100" />
            </Link>
            <Link
              to="/contact"
              className="flex items-center justify-center gap-2 border border-porto-fg/20 hover:bg-porto-fg/5 text-porto-fg px-6 sm:px-7 py-3 rounded-full font-semibold transition-colors text-sm sm:text-base"
            >
              {t("contact")}
            </Link>
          </div>

          {/* Socials - with brand colors and animations on hover */}
          <div className="flex items-center justify-center md:justify-start gap-3">
            {/* GitHub */}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="p-2.5 bg-porto-fg/5 hover:bg-[#333] rounded-full transition-all duration-300 text-porto-fg hover:text-white hover:scale-110 hover:shadow-[0_0_15px_rgba(51,51,51,0.5)] active:scale-95"
            >
              <FaGithub size={18} />
            </a>

            {/* LinkedIn */}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="p-2.5 bg-porto-fg/5 hover:bg-[#0A66C2] rounded-full transition-all duration-300 text-porto-fg hover:text-white hover:scale-110 hover:shadow-[0_0_15px_rgba(10,102,194,0.5)] active:scale-95"
            >
              <FaLinkedin size={18} />
            </a>

            {/* Instagram */}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="p-2.5 bg-porto-fg/5 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] rounded-full transition-all duration-300 text-porto-fg hover:text-white hover:scale-110 hover:shadow-[0_0_15px_rgba(220,39,67,0.5)] active:scale-95"
            >
              <FaInstagram size={18} />
            </a>

            {/* Telegram */}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
              className="p-2.5 bg-porto-fg/5 hover:bg-[#229ED9] rounded-full transition-all duration-300 text-porto-fg hover:text-white hover:scale-110 hover:shadow-[0_0_15px_rgba(34,158,217,0.5)] active:scale-95"
            >
              <FaTelegram size={18} />
            </a>
          </div>
        </motion.div>

        {/* Avatar */}
        <div className="order-1 md:order-2">
          <HeroAvatar />
        </div>
      </div>
    </section>
  );
}