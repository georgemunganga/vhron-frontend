import logoDark from "@/assets/logo-dark.svg";
import logoLight from "@/assets/logo-light.svg";

/**
 * VChron Logo component
 *
 * @param {"dark"|"light"} variant
 *   "dark"  → dark-coloured logo (use on white/light backgrounds)
 *   "light" → white/light logo   (use on dark/teal/coloured backgrounds)
 * @param {"xs"|"sm"|"md"|"lg"|"xl"} size
 * @param {string} className  – extra Tailwind classes
 */
const SIZES = {
  xs: "h-6",
  sm: "h-8",
  md: "h-10",
  lg: "h-16",
  xl: "h-18",
};

const Logo = ({ variant = "dark", size = "md", className = "" }) => {
  const src = variant === "light" ? logoLight : logoDark;
  const heightClass = SIZES[size] ?? SIZES.md;
  return (
    <img
      src={src}
      alt="VChron – Verified Workforce Intelligence"
      className={`${heightClass} w-auto object-contain ${className}`}
      draggable={false}
    />
  );
};

export default Logo;
