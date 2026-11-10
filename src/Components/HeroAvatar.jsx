import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaReact, FaHtml5, FaCss3Alt, FaFigma } from "react-icons/fa";
import { SiNextdotjs, SiDjango } from "react-icons/si";
import avatar from "../assets/avatar.jpg";
import irisLeft from "../assets/iris-left.png";
import irisRight from "../assets/iris-right.png";
import { useSettings } from "../Contex/SettingsContext";

/* آیکون‌های دور دایره — ترتیب و رنگ‌ها را اینجا عوض کن */
const techs = [
  { name: "React", Icon: FaReact, color: "#61dafb" },
  { name: "Next.js", Icon: SiNextdotjs, color: "currentColor" },
  { name: "Django", Icon: SiDjango, color: "#44b78b" },
  { name: "HTML5", Icon: FaHtml5, color: "#e34f26" },
  { name: "CSS3", Icon: FaCss3Alt, color: "#2d9cf0" },
  { name: "Figma", Icon: FaFigma, color: "#f24e1e" },
];

/* مختصات چشم‌ها روی عکس avatar.jpg (در مقیاس ۳۴۰×۳۴۰).
   اگر عکس دیگری گذاشتی فقط همین اعداد را عوض کن.
   cx,cy = مرکز شکل چشم | ix,iy = مرکز عنبیه | rx,ry = اندازه‌ی بیضی چشم | rot = کجی چشم */
const EYES = [
  { id: "l", src: irisLeft, cx: 145.2, cy: 134.6, rx: 11.6, ry: 6.6, rot: 4, ix: 147, iy: 134.7 },
  { id: "r", src: irisRight, cx: 194, cy: 133, rx: 11.6, ry: 6.8, rot: -6, ix: 192, iy: 133.3 },
];
const MAX_X = 3.6; // بیشترین حرکت چپ و راست
const MAX_Y = 1.6; // بیشترین حرکت بالا و پایین

function Eyes() {
  const svgRef = useRef(null);
  const irisRefs = useRef([]);

  useEffect(() => {
    let mx = window.innerWidth / 2,
      my = window.innerHeight / 2,
      raf;
    const cur = EYES.map(() => [0, 0]);

    const aim = (e) => {
      const p = e.touches ? e.touches[0] : e;
      mx = p.clientX;
      my = p.clientY;
    };
    window.addEventListener("pointermove", aim);
    window.addEventListener("touchmove", aim, { passive: true });

    const loop = () => {
      const svg = svgRef.current;
      if (svg) {
        const r = svg.getBoundingClientRect();
        const s = svg.clientWidth / 340;
        EYES.forEach((eye, i) => {
          const dx = mx - (r.left + eye.cx * s);
          const dy = my - (r.top + eye.cy * s);
          const d = Math.hypot(dx, dy) || 1;
          const m = Math.min(d / 260, 1); // نزدیک موس → حرکت کمتر
          cur[i][0] += ((dx / d) * m * MAX_X - cur[i][0]) * 0.14; // نرم شدن حرکت
          cur[i][1] += ((dy / d) * m * MAX_Y - cur[i][1]) * 0.14;
          irisRefs.current[i]?.setAttribute(
            "transform",
            `translate(${eye.ix + cur[i][0]} ${eye.iy + cur[i][1]})`
          );
        });
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", aim);
      window.removeEventListener("touchmove", aim);
    };
  }, []);

  return (
    <svg ref={svgRef} viewBox="0 0 340 340" className="absolute inset-0 w-full h-full">
      <defs>
        <radialGradient id="sclera" cx="50%" cy="45%" r="60%">
          <stop offset="0" stopColor="#f6ebdf" />
          <stop offset=".7" stopColor="#e6d2bf" />
          <stop offset="1" stopColor="#bf9a82" />
        </radialGradient>
        <linearGradient id="lid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6b3a22" stopOpacity=".55" />
          <stop offset=".45" stopColor="#6b3a22" stopOpacity="0" />
        </linearGradient>
        <clipPath id="iris-clip">
          <circle r="6.7" />
        </clipPath>
        {EYES.map((e) => (
          <clipPath id={`eye-${e.id}`} key={e.id}>
            <ellipse cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} transform={`rotate(${e.rot} ${e.cx} ${e.cy})`} />
          </clipPath>
        ))}
      </defs>

      {EYES.map((e, i) => (
        <g key={e.id} clipPath={`url(#eye-${e.id})`}>
          {/* سفیدی چشم (عنبیه‌ی قدیمی را می‌پوشاند) */}
          <ellipse cx={e.cx} cy={e.cy} rx={e.rx + 1.5} ry={e.ry + 1.5} fill="url(#sclera)" />
          {/* عنبیه‌ی واقعی کاراکتر که با موس حرکت می‌کند */}
          <g ref={(el) => (irisRefs.current[i] = el)} transform={`translate(${e.ix} ${e.iy})`}>
            <image href={e.src} x="-7" y="-7" width="14" height="14" clipPath="url(#iris-clip)" />
          </g>
          {/* سایه‌ی پلک بالا */}
          <rect x={e.cx - 15} y={e.cy - 9} width="30" height="9" fill="url(#lid)" />
        </g>
      ))}
    </svg>
  );
}

export default function HeroAvatar() {
  const [flipped, setFlipped] = useState(false);
  const { t } = useSettings();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative grid place-items-center w-full h-[340px] sm:h-[440px] lg:h-[500px] [--r:140px] sm:[--r:185px] lg:[--r:215px]"
    >
      {/* حلقه‌ی چرخان آیکون‌ها */}
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div className="orbit-spin relative w-[calc(var(--r)*2)] h-[calc(var(--r)*2)] rounded-full border border-dashed border-porto-gold/30">
          {techs.map(({ name, Icon, color }, i) => {
            const a = (360 / techs.length) * i;
            return (
              <div
                key={name}
                className="absolute left-1/2 top-1/2 -ml-[22px] -mt-[22px]"
                style={{ transform: `rotate(${a}deg) translateY(calc(var(--r) * -1))` }}
              >
                <div style={{ transform: `rotate(${-a}deg)` }}>
                  <div className="orbit-spin-rev">
                    <div
                      title={name}
                      aria-label={name}
                      className="pointer-events-auto grid place-items-center w-11 h-11 rounded-full bg-porto-card/90 text-porto-fg border border-porto-fg/10 backdrop-blur-md shadow-lg shadow-black/30 transition-transform hover:scale-125"
                    >
                      <Icon size={22} color={color} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* دایره‌ی کاراکتر (قابل چرخاندن) */}
      <div className="relative z-10 w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] lg:w-[340px] lg:h-[340px]" style={{ perspective: 1000 }}>
        <div
          onClick={() => setFlipped((f) => !f)}
          className="relative w-full h-full cursor-pointer"
          style={{
            transformStyle: "preserve-3d",
            transition: "transform .9s cubic-bezier(.2,.8,.2,1)",
            transform: flipped ? "rotateY(180deg)" : "none",
          }}
        >
          <div className="avatar-face absolute inset-0 rounded-full overflow-hidden border-[5px]" style={{ backfaceVisibility: "hidden" }}>
            <img src={avatar} alt="Character" className="w-full h-full object-cover" draggable="false" />
            <Eyes />
          </div>
          <div
            className="avatar-face absolute inset-0 rounded-full overflow-hidden border-[5px] bg-[var(--avatar-back)] grid place-items-center text-center font-mono text-xs sm:text-sm text-porto-gold leading-7"
            dir="ltr"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div>
              {"{ role: \"frontend\","}
              <br />
              {"  stack: [\"React\", \"Tailwind\"],"}
              <br />
              {"  status: \"available\" }"}
            </div>
          </div>
        </div>
      </div>

      <p className="absolute bottom-0 text-xs text-porto-text">{t("tip")}</p>
    </motion.div>
  );
}
