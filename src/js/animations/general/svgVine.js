import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let animations = [];

const createAnimations = (paths) => {
  paths.forEach((path) => {
    const pathLength = path.getTotalLength();
    const originalFill = path.getAttribute("fill");

    const strokePath = path.cloneNode();
    path.parentNode.insertBefore(strokePath, path);

    gsap.set(path, {
      fill: originalFill,
      opacity: 0,
    });

    gsap.set(strokePath, {
      fill: "none",
      stroke: "#296B29",
      strokeWidth: 2,
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    const tl = gsap.timeline({
      paused: true,
      defaults: {
        ease: "power2.out",
      },
    });

    // Animate the stroke drawing
    tl.to(strokePath, {
      duration: 5.5, // prev 4.5
      strokeDashoffset: 0,
      ease: "power2.out",
    })
      // Fade in the fill path
      .to(
        path,
        {
          duration: 2.55, // prev 1.55
          opacity: 1,
          ease: "power2.out",
        },
        "-=5.25"
      )
      // Fade out the stroke path

      .to(
        strokePath,
        {
          duration: 1.55, // prev 0.8
          opacity: 0,
          ease: "power2.out",
        },
        "<"
      );

    ScrollTrigger.create({
      trigger: path,
      start: "top 80%",
      once: true,
      onEnter: () => tl.play(),
    });

    animations.push(tl);
  });
};

export const initSvgDraw = () => {
  const paths = document.querySelectorAll('svg[data-draw="vine"] path');

  if (paths.length === 0) return;

  createAnimations(paths);

  return () => {
    animations.forEach((animation) => animation.kill());
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    document.querySelectorAll('svg[data-draw="vine"] path').forEach((path) => {
      if (path.getAttribute("data-clone")) {
        path.remove();
      }
    });
    animations = [];
  };
};

export const refreshSvgDraw = () => {
  ScrollTrigger.refresh();
};
