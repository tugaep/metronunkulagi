import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isLightColor(hsl: string): boolean {
  if (!hsl) return false;
  const parts = hsl.split(' ');
  if (parts.length < 3) return false;

  const h = parseFloat(parts[0]);
  const l = parseFloat(parts[2].replace('%', ''));

  // Yellows (40-60) are bright even at lower lightness
  if (h > 40 && h < 60) return l > 40;

  // Cyans/Teals can also be bright
  if (h > 170 && h < 200) return l > 45;

  return l > 55;
}
