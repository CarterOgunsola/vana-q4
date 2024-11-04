// src/js/utils/smoothScroll.js
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

class SmoothScroll {
  constructor() {
    this.lenis = new Lenis({
      autoinit: true,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -12 * t)), // https://www.desmos.com/calculator/brs54l4xou
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      smoothTouch: false,
      useOverscroll: true,
      useAnchor: true,
      touchMultiplier: 1.5,
      infinite: false,
    });

    this.init();
  }

  init() {
    // Update ScrollTrigger on Lenis scroll
    this.lenis.on("scroll", ScrollTrigger.update);

    // Add Lenis scroll to GSAP ticker
    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });

    // Disable GSAP ticker lag smoothing
    gsap.ticker.lagSmoothing(0);
  }

  // Method to scroll to a specific element
  scrollTo(target, options = {}) {
    this.lenis.scrollTo(target, options);
  }

  // Method to stop scrolling
  stop() {
    this.lenis.stop();
  }

  // Method to start scrolling
  start() {
    this.lenis.start();
  }

  // Method to destroy instance
  destroy() {
    this.lenis.destroy();
    gsap.ticker.remove(this.lenis.raf);
  }

  // Get lenis instance
  getLenis() {
    return this.lenis;
  }
}

// Create and export a single instance
export const smoothScroll = new SmoothScroll();
