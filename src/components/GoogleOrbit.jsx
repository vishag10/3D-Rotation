import { useEffect, useRef, useState, useCallback } from "react";

const ICONS = [
  {
    name: "gmail",
    offset: 0.3,
    tiltX: 0.78,
    tiltY: 0.55,
    axisAngle: -0.35,
    speed: 1 / 16,
    svg: (
      <svg viewBox="0 0 48 38" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="46" height="36" rx="3" fill="#f2f2f2" />
        <path d="M2 2L24 18L46 2" fill="#EA4335" />
        <path d="M1 5L24 20L47 5V37H1Z" fill="#f2f2f2" />
        <path
          d="M2 3.5L24 19.5L46 3.5"
          fill="none"
          stroke="#EA4335"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect
          x="1" y="1" width="46" height="36" rx="3"
          fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="0.8"
        />
      </svg>
    ),
  },
  {
    name: "calendar",
    offset: 2.1,
    tiltX: 0.55,
    tiltY: 0.9,
    axisAngle: 0.5,
    speed: 1 / 20,
    svg: (
      <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="7" width="40" height="37" rx="3" fill="white" />
        <rect x="4" y="7" width="40" height="14" rx="3" fill="#1a73e8" />
        <rect x="4" y="18" width="40" height="3" fill="#1a73e8" />
        <rect x="4" y="7" width="40" height="37" rx="3" fill="none" stroke="#dadce0" strokeWidth="0.8" />
        <line x1="4" y1="21" x2="44" y2="21" stroke="#dadce0" strokeWidth="0.7" />
        <line x1="20" y1="21" x2="20" y2="44" stroke="#dadce0" strokeWidth="0.7" />
        <line x1="32" y1="21" x2="32" y2="44" stroke="#dadce0" strokeWidth="0.7" />
        <line x1="4" y1="32" x2="44" y2="32" stroke="#dadce0" strokeWidth="0.7" />
        <text x="10" y="17" fontSize="7" fill="white" fontFamily="sans-serif" fontWeight="700">JUL</text>
        <text x="12" y="39" fontSize="13" fill="#1a73e8" fontFamily="sans-serif" fontWeight="700">9</text>
        <rect x="10" y="3" width="5" height="8" rx="2" fill="#1a73e8" />
        <rect x="33" y="3" width="5" height="8" rx="2" fill="#1a73e8" />
      </svg>
    ),
  },
  {
    name: "drive",
    offset: 3.8,
    tiltX: 1.0,
    tiltY: 0.38,
    axisAngle: 0.18,
    speed: 1 / 14,
    svg: (
      <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <polygon points="24,6 8,38 16,38 24,22" fill="#0F9D58" />
        <polygon points="24,6 32,22 40,38 24,22" fill="#4285F4" />
        <polygon points="8,38 40,38 32,22 16,22" fill="#F4B400" />
      </svg>
    ),
  },
  {
    name: "photos",
    offset: 5.2,
    tiltX: 0.68,
    tiltY: 0.72,
    axisAngle: -0.7,
    speed: 1 / 22,
    svg: (
      <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path d="M24,24 C24,24 24,13 15,13 C10.6,13 8,16 8,19 C8,22 10.5,24 15,24 Z" fill="#EA4335" />
        <path d="M24,24 C24,24 13,24 13,33 C13,37.4 16,40 19,40 C22,40 24,37.5 24,33 Z" fill="#4285F4" />
        <path d="M24,24 C24,24 35,24 35,15 C35,10.6 32,8 29,8 C26,8 24,10.5 24,15 Z" fill="#0F9D58" />
        <path d="M24,24 C24,24 24,35 33,35 C37.4,35 40,32 40,29 C40,26 37.5,24 33,24 Z" fill="#F4B400" />
      </svg>
    ),
  },
];

// Random profile photos from picsum.photos (curated good portrait seeds)
const RANDOM_PROFILES = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function IconSquircle({ svg, size, tiltDeg, opacity, shadow }) {
  return (
    <div
      style={{
        position: "absolute",
        transform: "translate(-50%, -50%)",
        opacity,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          background: "#13171e",
          borderRadius: "28%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: shadow,
          transform: `rotate(${tiltDeg}deg)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* shine */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%", height: "42%",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.06), transparent)",
            borderRadius: "28% 28% 0 0",
          }}
        />
        <div style={{ width: "56%", height: "56%", position: "relative", zIndex: 1 }}>
          {svg}
        </div>
      </div>
    </div>
  );
}

export default function GoogleOrbit() {
  const sceneRef = useRef(null);
  const rafRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const fileInputRef = useRef(null);

  // Load a random profile photo on mount
  useEffect(() => {
    const randomUrl = RANDOM_PROFILES[Math.floor(Math.random() * RANDOM_PROFILES.length)];
    setPhoto(randomUrl);
  }, []);

  // Store icon states for both layers
  const [iconStates, setIconStates] = useState(
    ICONS.map(() => ({
      x: 0, y: 0, size: 0, tiltDeg: 0,
      opacity: 1, shadow: "", isBehind: false, visible: false,
    }))
  );

  const animate = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const W = scene.offsetWidth;
    const H = scene.offsetHeight;
    const cx = W * 0.5;
    const cy = H * 0.5;

    const baseRx = W * 0.43;
    const baseRy = H * 0.32;
    const baseSize = W * 0.135;

    const t = performance.now() / 1000;

    const next = ICONS.map((ic) => {
      const angle = t * 2 * Math.PI * ic.speed + ic.offset;
      const rx = baseRx * ic.tiltX;
      const ry = baseRy * ic.tiltY;
      const cosA = ic.axisAngle;

      const localX = Math.cos(angle) * rx;
      const localY = Math.sin(angle) * ry;

      const x = cx + localX * Math.cos(cosA) - localY * Math.sin(cosA);
      const y = cy + localX * Math.sin(cosA) + localY * Math.cos(cosA);

      const rotatedY = localX * Math.sin(cosA) + localY * Math.cos(cosA);
      const depth = (rotatedY / baseRy + 1) / 2;

      const scale = lerp(0.58, 1.08, depth);
      const opacity = lerp(0.38, 1.0, depth);
      const size = baseSize * scale;
      const tiltDeg = angle * (180 / Math.PI) * 0.5;
      const shadow = `0 ${4 + depth * 16}px ${12 + depth * 28}px rgba(0,0,0,${(0.5 + depth * 0.35).toFixed(2)})`;
      const isBehind = depth < 0.52;

      return { x, y, size, tiltDeg, opacity, shadow, isBehind, visible: true };
    });

    setIconStates(next);
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const W = sceneRef.current?.offsetWidth || 530;
  const circR = W * 0.225;

  return (
    <div
      ref={sceneRef}
      style={{
        width: "100%",
        aspectRatio: "530/418",
        maxWidth: 530,
        margin: "0 auto",
        position: "relative",
        background: "#070707",
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      {/* Atmospheric glow */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          background:
            "radial-gradient(ellipse 55% 50% at 68% 58%, rgba(130,15,15,0.38) 0%, transparent 60%), " +
            "radial-gradient(ellipse 45% 40% at 28% 38%, rgba(15,35,110,0.32) 0%, transparent 55%)",
        }}
      />

      {/* Behind layer */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        {iconStates.map((s, i) =>
          s.visible && s.isBehind ? (
            <div key={ICONS[i].name + "-behind"} style={{ position: "absolute", left: s.x, top: s.y }}>
              <IconSquircle
                svg={ICONS[i].svg}
                size={s.size} tiltDeg={s.tiltDeg}
                opacity={s.opacity} shadow={s.shadow}
              />
            </div>
          ) : null
        )}
      </div>

      {/* Center circle */}
      <div
        style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)", zIndex: 2,
        }}
      >
        <div
          onClick={handlePhotoClick}
          style={{
            width: circR * 2, height: circR * 2,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.22)",
            boxShadow: "0 0 0 6px rgba(255,255,255,0.04), 0 0 60px rgba(0,0,0,0.95)",
            overflow: "hidden", cursor: "pointer",
            background: "#0e0e0e", position: "relative",
          }}
        >
          {photo ? (
            <img
              src={photo} alt="profile"
              style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%) brightness(0.82)" }}
            />
          ) : (
            <div
              style={{
                width: "100%", height: "100%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "linear-gradient(135deg,#1c2330,#0b0f18)",
                color: "rgba(255,255,255,0.28)",
                fontFamily: "-apple-system, sans-serif", fontSize: 11,
                textAlign: "center", lineHeight: 1.6,
              }}
            >
              Tap to add<br />your photo
            </div>
          )}
          {/* inner vignette */}
          <div
            style={{
              position: "absolute", inset: 0, borderRadius: "50%", pointerEvents: "none",
              boxShadow: "inset 0 0 20px 10px rgba(0,0,0,0.75)", zIndex: 10,
            }}
          />
        </div>
      </div>

      {/* Front layer */}
      <div style={{ position: "absolute", inset: 0, zIndex: 3 }}>
        {iconStates.map((s, i) =>
          s.visible && !s.isBehind ? (
            <div key={ICONS[i].name + "-front"} style={{ position: "absolute", left: s.x, top: s.y }}>
              <IconSquircle
                svg={ICONS[i].svg}
                size={s.size} tiltDeg={s.tiltDeg}
                opacity={s.opacity} shadow={s.shadow}
              />
            </div>
          ) : null
        )}
      </div>

      {/* Hint */}
      <div
        style={{
          position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
          fontFamily: "'Inter', -apple-system, sans-serif", fontSize: 10,
          color: "rgba(255,255,255,0.13)", letterSpacing: "0.12em",
          whiteSpace: "nowrap", zIndex: 9,
        }}
      >
        Tap circle · change your photo
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef} type="file" accept="image/*"
        style={{ display: "none" }} onChange={handleFileChange}
      />
    </div>
  );
}
