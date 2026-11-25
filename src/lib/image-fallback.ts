import React from "react";
import { logoImg } from "@/data/products";

export const FALLBACK_PRODUCT_IMAGE = logoImg;

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = e.currentTarget;
  if (target.dataset["hasFallback"]) return;
  target.dataset["hasFallback"] = "true";
  target.src = FALLBACK_PRODUCT_IMAGE;
}
