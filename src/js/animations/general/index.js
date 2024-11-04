import { useComponents } from "./components";
import { smoothScroll } from "../../utils/smoothScroll";
import { initParallax } from "./parallax";
import { initSvgDraw } from "./svgVine";

export function useGeneral() {
  useComponents();
  initParallax();
  initSvgDraw();
  document.documentElement.classList.add("lenis", "lenis-smooth");
}
