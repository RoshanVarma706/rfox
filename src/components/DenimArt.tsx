import { useId } from "react";
import type { Palette, Silhouette } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const GARMENT: Record<Silhouette, string> = {
  jeans:
    "M110 84 H290 V112 C294 160 292 210 289 250 L270 466 H212 L201 304 L199 304 L188 466 H130 L111 250 C108 210 106 160 110 112 Z",
  cargo:
    "M110 84 H290 V112 C294 160 292 210 289 250 L272 466 H214 L201 304 L199 304 L186 466 H128 L111 250 C108 210 106 160 110 112 Z",
  jacket:
    "M152 132 C168 120 232 120 248 132 L286 148 L344 302 L314 336 L286 268 L288 424 H112 L114 268 L86 336 L56 302 L114 148 Z",
  shirt:
    "M154 136 C170 124 230 124 246 136 L284 152 L332 268 L306 292 L286 240 L288 424 H112 L114 240 L94 292 L68 268 L116 152 Z",
};

function luminance(hex: string) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

type Props = {
  palette: Palette;
  silhouette?: Silhouette;
  className?: string;
  showTag?: boolean;
};

export function DenimArt({ palette, silhouette = "jeans", className, showTag = true }: Props) {
  const raw = useId().replace(/[^a-zA-Z0-9]/g, "");
  const wash = `wash-${raw}`;
  const twill = `twill-${raw}`;
  const clip = `clip-${raw}`;
  const glow = `glow-${raw}`;

  const light = luminance(palette.base) > 0.62;
  const stitch = light ? "rgba(58,44,28,0.42)" : "rgba(255,246,232,0.55)";
  const seam = light ? "rgba(58,44,28,0.22)" : "rgba(255,246,232,0.24)";
  const path = GARMENT[silhouette];

  return (
    <svg
      viewBox="0 0 400 520"
      role="img"
      aria-label={`${silhouette} illustration in ${palette.base}`}
      className={cn("h-full w-full", className)}
    >
      <defs>
        <linearGradient id={wash} x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={palette.light} />
          <stop offset="46%" stopColor={palette.base} />
          <stop offset="100%" stopColor={palette.deep} />
        </linearGradient>
        <pattern id={twill} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(42)">
          <rect width="7" height="7" fill="transparent" />
          <path d="M0 0V7" stroke="#ffffff" strokeOpacity={light ? 0.26 : 0.13} strokeWidth="1.6" />
        </pattern>
        <clipPath id={clip}>
          <path d={path} />
        </clipPath>
        <radialGradient id={glow} cx="0.32" cy="0.18" r="0.75">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={light ? 0.28 : 0.22} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft studio shadow */}
      <ellipse cx="200" cy="486" rx="118" ry="14" fill="#121114" opacity="0.1" />

      <g clipPath={`url(#${clip})`}>
        <path d={path} fill={`url(#${wash})`} />
        <path d={path} fill={`url(#${twill})`} />
        <rect x="0" y="0" width="400" height="520" fill={`url(#${glow})`} />
        {/* drape shading */}
        <path
          d="M112 150 C170 210 176 300 150 470 L120 470 L108 220 Z"
          fill="#000000"
          opacity="0.07"
        />
        <path
          d="M288 150 C240 214 236 320 258 470 L282 470 L294 220 Z"
          fill="#ffffff"
          opacity="0.05"
        />
      </g>

      <path d={path} fill="none" stroke={palette.deep} strokeOpacity="0.55" strokeWidth="1.4" strokeLinejoin="round" />

      {(silhouette === "jeans" || silhouette === "cargo") && (
        <g fill="none" stroke={stitch} strokeWidth="1.2" strokeDasharray="4 4" strokeLinecap="round">
          <path d="M113 108 H287" />
          <path d="M113 92 H287" strokeOpacity="0.6" />
          <path d="M112 118 C132 120 146 136 148 160" />
          <path d="M288 118 C268 120 254 136 252 160" />
          <path d="M199 160 C201 214 199 262 199 302" strokeOpacity="0.5" />
          <path d="M199 304 L188 460" strokeOpacity="0.7" />
          <path d="M201 304 L212 460" strokeOpacity="0.7" />
          <path d="M134 462 H186" />
          <path d="M214 462 H266" />
          <path d="M112 300 C114 340 118 400 124 458" strokeOpacity="0.35" />
          <path d="M288 300 C286 340 282 400 276 458" strokeOpacity="0.35" />
        </g>
      )}

      {/* fly + coins */}
      {(silhouette === "jeans" || silhouette === "cargo") && (
        <g>
          <path d="M202 112 C206 128 204 144 197 154" fill="none" stroke={seam} strokeWidth="2" />
          <circle cx="149" cy="160" r="2.6" fill={stitch} />
          <circle cx="251" cy="160" r="2.6" fill={stitch} />
          <circle cx="200" cy="112" r="3.4" fill={light ? "#5a4a33" : "#cfd6db"} opacity="0.85" />
        </g>
      )}

      {silhouette === "cargo" && (
        <g fill="none" stroke={stitch} strokeWidth="1.2">
          <rect x="124" y="286" width="54" height="58" rx="2" strokeDasharray="4 4" />
          <rect x="222" y="286" width="54" height="58" rx="2" strokeDasharray="4 4" />
          <path d="M124 302 H178" strokeDasharray="4 4" />
          <path d="M222 302 H276" strokeDasharray="4 4" />
          <circle cx="151" cy="332" r="2.4" fill={stitch} stroke="none" />
          <circle cx="249" cy="332" r="2.4" fill={stitch} stroke="none" />
        </g>
      )}

      {silhouette === "jacket" && (
        <g>
          <path d="M152 132 L200 176 L248 132" fill="none" stroke={stitch} strokeWidth="1.4" strokeDasharray="5 4" />
          <path d="M200 176 V424" fill="none" stroke={seam} strokeWidth="2" />
          <g fill="none" stroke={stitch} strokeWidth="1.2" strokeDasharray="4 4">
            <rect x="128" y="206" width="52" height="44" rx="2" />
            <rect x="226" y="206" width="52" height="44" rx="2" />
            <path d="M128 218 H180" />
            <path d="M226 218 H278" />
            <path d="M112 402 H288" />
            <path d="M118 336 H142" />
            <path d="M264 336 H288" />
          </g>
          {[228, 268, 308, 348, 388].map((y) => (
            <circle key={y} cx="200" cy={y} r="3.2" fill={light ? "#5a4a33" : "#d6dde2"} opacity="0.9" />
          ))}
        </g>
      )}

      {silhouette === "shirt" && (
        <g>
          <path d="M154 136 L200 166 L246 136" fill="none" stroke={stitch} strokeWidth="1.4" strokeDasharray="5 4" />
          <path d="M200 166 V424" fill="none" stroke={seam} strokeWidth="2" />
          <g fill="none" stroke={stitch} strokeWidth="1.2" strokeDasharray="4 4">
            <path d="M124 200 H172 V250 H124" />
            <path d="M112 420 H288" />
            <path d="M118 250 C116 320 116 370 114 420" strokeOpacity="0.4" />
          </g>
          {[196, 236, 276, 316, 356, 396].map((y) => (
            <circle key={y} cx="200" cy={y} r="3" fill={light ? "#5a4a33" : "#d6dde2"} opacity="0.9" />
          ))}
        </g>
      )}

      {/* belt loops */}
      {(silhouette === "jeans" || silhouette === "cargo") && (
        <g fill="none" stroke={palette.deep} strokeOpacity="0.5" strokeWidth="1.4">
          <path d="M128 82 V114" />
          <path d="M170 82 V112" />
          <path d="M230 82 V112" />
          <path d="M272 82 V114" />
        </g>
      )}

      {showTag && (
        <g>
          <rect x="266" y="98" width="18" height="10" rx="1" fill="#E5182A" />
          <path d="M269 103 H277" stroke="#fff" strokeWidth="1.1" strokeOpacity="0.85" />
        </g>
      )}
    </svg>
  );
}

export function DenimSwatch({ palette, className }: { palette: Palette; className?: string }) {
  return (
    <span
      className={cn("inline-block h-5 w-5 rounded-full ring-1 ring-inset ring-black/15", className)}
      style={{ background: `linear-gradient(140deg, ${palette.light}, ${palette.base} 55%, ${palette.deep})` }}
      aria-hidden
    />
  );
}
