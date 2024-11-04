// src/js/utils/parallax.js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function createParallax(element, options = {}) {
  const defaults = {
    speed: 1,
    direction: "vertical",
    start: "top bottom",
    end: "bottom top",
    scrub: true,
    reverse: false,
  };

  const settings = { ...defaults, ...options };

  const verticalDistance =
    element.offsetHeight * settings.speed * (settings.reverse ? -1 : 1);
  const horizontalDistance =
    element.offsetWidth * settings.speed * (settings.reverse ? -1 : 1);

  return gsap.to(element, {
    y: settings.direction === "vertical" ? verticalDistance : 0,
    x: settings.direction === "horizontal" ? horizontalDistance : 0,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: settings.start,
      end: settings.end,
      scrub: settings.scrub,
      markers: false,
    },
  });
}
