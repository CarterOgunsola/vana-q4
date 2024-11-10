// src/js/utils/parallax.js
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (!gsap.plugins?.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

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

  // Safeguard against null elements
  if (!element) {
    console.warn("Parallax element not found");
    return null;
  }

  // Calculate distances based on element dimensions
  const verticalDistance =
    element.offsetHeight * settings.speed * (settings.reverse ? -1 : 1);
  const horizontalDistance =
    element.offsetWidth * settings.speed * (settings.reverse ? -1 : 1);

  // Create and return the animation
  try {
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
        // Optional: add invalidateOnRefresh if element dimensions might change
        invalidateOnRefresh: true,
      },
    });
  } catch (error) {
    console.error("Error creating parallax animation:", error);
    return null;
  }
}

// Optional: Add a utility function to create multiple parallax instances
export function createMultipleParallax(selector, options = {}) {
  const elements = document.querySelectorAll(selector);
  return Array.from(elements).map((element) =>
    createParallax(element, options)
  );
}
