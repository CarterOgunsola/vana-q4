import { createParallax } from "../../utils/parallax";

export function initParallax() {
  const parallaxElements = document.querySelectorAll("[data-parallax]");
  parallaxElements.forEach((element) => {
    const speed = element.dataset.parallaxSpeed || 0.5;
    const direction = element.dataset.parallaxDirection || "vertical";
    const start = element.dataset.parallaxStart || "top bottom";
    const end = element.dataset.parallaxEnd || "bottom top";
    const scrub = element.dataset.parallaxScrub || true;
    const reverse = element.dataset.parallaxReverse || false;
    createParallax(element, { speed, direction, start, end, scrub, reverse });
  });
}
