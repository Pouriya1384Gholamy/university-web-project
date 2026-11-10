import { Canvas } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { Suspense } from "react";
import { useSettings } from "../Contex/SettingsContext.jsx";

const GOLD = "#f5a623";

function Shape({ position, speed = 1.5, children }) {
  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={0.8}>
      <mesh position={position}>{children}</mesh>
    </Float>
  );
}

/* شکل‌های شناور پس‌زمینه. در حالت فارسی (راست‌به‌چپ) جای شکل‌ها آینه می‌شود
   چون کاراکتر به سمت چپ می‌رود. */
export default function Hero3D() {
  const { isRtl, isDark } = useSettings();
  const m = isRtl ? -1 : 1;
  const teal = isDark ? "#2dd4bf" : "#0d9488";

  return (
    <div className="absolute inset-0 z-0 hidden md:block pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 1.5]}>
        <ambientLight intensity={isDark ? 0.6 : 1.1} />
        <directionalLight position={[3, 5, 4]} intensity={isDark ? 2 : 2.4} color="#ffe2b0" />
        <pointLight position={[-4 * m, -2, 3]} intensity={30} color={teal} />

        <Suspense fallback={null}>
          <Shape position={[5.4 * m, -1.8, 0]} speed={1.4}>
            <torusGeometry args={[0.45, 0.17, 24, 48]} />
            <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} />
          </Shape>
          <Shape position={[5.0 * m, 2.0, -0.5]} speed={1.8}>
            <octahedronGeometry args={[0.5]} />
            <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.3} />
          </Shape>
          <Shape position={[2.3 * m, -2.7, 0]} speed={1.2}>
            <torusGeometry args={[0.4, 0.15, 24, 48]} />
            <meshStandardMaterial color={teal} metalness={0.7} roughness={0.3} />
          </Shape>
          <Shape position={[1.9 * m, 2.4, -1]} speed={2}>
            <icosahedronGeometry args={[0.28]} />
            <meshStandardMaterial color={isDark ? "#e8d9bb" : "#b8a17a"} metalness={0.8} roughness={0.35} flatShading />
          </Shape>
          <Sparkles count={40} scale={[12, 7, 4]} size={1.6} color={isDark ? GOLD : "#d98a0b"} opacity={isDark ? 0.3 : 0.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}
