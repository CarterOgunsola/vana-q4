import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useComponents } from "./components";
import { smoothScroll } from "../../utils/smoothScroll";
import { initParallax } from "./parallax";
import { initSvgDraw } from "./svgVine";
import { dotEffect } from "./dotEffect";
import { staggerText } from "./staggerText";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export function useGeneral() {
  useComponents();
  initParallax();
  initSvgDraw();
  dotEffect();
  staggerText();
  document.documentElement.classList.add("lenis", "lenis-smooth");
}
