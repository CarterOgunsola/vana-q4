// import * as PIXI from "pixi.js";
// import gsap from "gsap";

// export const PolkaDotEffect = () => {
//   // Find container with data attribute
//   let container = document.querySelector('[data-canvas="polka-dot"]');

//   if (!container) {
//     console.error(
//       "Container not found! Ensure that there is an element with 'data-canvas=\"polka-dot\"'"
//     );
//     return;
//   }

//   // Set container styles
//   container.style.position = "absolute";
//   container.style.top = "0";
//   container.style.left = "0";
//   container.style.width = "100%";
//   container.style.height = "100%";
//   container.style.pointerEvents = "none";
//   container.style.zIndex = "1";

//   // Initialize Pixi.js Application
//   const app = new PIXI.Application({
//     width: container.clientWidth, // Ensure correct width
//     height: container.clientHeight, // Ensure correct height
//     backgroundAlpha: 0, // Transparent background
//     resolution: window.devicePixelRatio || 2, // High resolution for better quality
//     antialias: true, // Enable antialiasing
//   });

//   // Check if app.view is properly created
//   if (!app.view) {
//     console.error("Pixi.js failed to create a view (canvas).");
//     return;
//   }

//   // Append the canvas to the container
//   container.appendChild(app.view);

//   const config = {
//     dotSize: 3,
//     gapSize: 12,
//     radius: 100,
//     maxScale: 2,
//     dotColor: 0x6e0e7f, // Purple color
//     animationDuration: 0.5,
//   };

//   const dots = [];
//   const createDots = () => {
//     // Clear previous dots
//     dots.forEach((dot) => dot.destroy());
//     dots.length = 0;
//     app.stage.removeChildren();

//     const cols = Math.floor(
//       container.clientWidth / (config.dotSize + config.gapSize)
//     );
//     const rows = Math.floor(
//       container.clientHeight / (config.dotSize + config.gapSize)
//     );

//     for (let i = 0; i < rows * cols; i++) {
//       const dot = new PIXI.Graphics();
//       dot.beginFill(config.dotColor);
//       dot.drawCircle(0, 0, config.dotSize);
//       dot.endFill();

//       dot.x = (i % cols) * (config.dotSize + config.gapSize);
//       dot.y = Math.floor(i / cols) * (config.dotSize + config.gapSize);

//       app.stage.addChild(dot);
//       dots.push(dot);
//     }
//   };

//   app.ticker.add(() => {
//     const mousePosition = app.renderer.plugins.interaction.mouse.global;

//     dots.forEach((dot) => {
//       const dist = Math.sqrt(
//         (mousePosition.x - dot.x) ** 2 + (mousePosition.y - dot.y) ** 2
//       );

//       const scaleFactor =
//         dist < config.radius
//           ? 1 + (config.maxScale - 1) * (1 - dist / config.radius)
//           : 1;

//       gsap.to(dot.scale, {
//         x: scaleFactor,
//         y: scaleFactor,
//         duration: config.animationDuration,
//         ease: "expo.out",
//       });
//     });
//   });

//   window.addEventListener("resize", () => {
//     app.renderer.resize(container.clientWidth, container.clientHeight);
//     createDots();
//   });

//   createDots();

//   return () => {
//     if (app) {
//       app.destroy(true);
//     }
//     if (container && container.parentNode) {
//       container.parentNode.removeChild(container);
//     }
//   };
// };

import * as PIXI from "pixi.js";
import gsap from "gsap";

export async function createPolkaDots(
  container,
  dotSize = 3,
  gapSize = 12,
  radius = 100,
  maxScale = 2
) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) return;

  const app = new PIXI.Application({
    width: container.clientWidth,
    height: container.clientHeight,
    backgroundAlpha: 0,
    resolution: window.devicePixelRatio || 2,
    antialias: true,
    useInteraction: true, // Ensures interaction system is enabled
  });

  await app.init();

  container.appendChild(app.canvas);

  const dots = [];
  const cols = Math.floor(container.clientWidth / (dotSize + gapSize));
  const rows = Math.floor(container.clientHeight / (dotSize + gapSize));

  for (let i = 0; i < rows * cols; i++) {
    const dot = new PIXI.Graphics();
    dot.beginFill(0x6e0e7f);
    dot.drawCircle(0, 0, dotSize);
    dot.endFill();
    dot.x = (i % cols) * (dotSize + gapSize);
    dot.y = Math.floor(i / cols) * (dotSize + gapSize);
    app.stage.addChild(dot);
    dots.push(dot);
  }

  // Check if the interaction system is initialized before accessing mouse
  app.ticker.add(() => {
    if (app.renderer.plugins.interaction) {
      const mouseX = app.renderer.plugins.interaction.mouse.global.x || 0;
      const mouseY = app.renderer.plugins.interaction.mouse.global.y || 0;

      dots.forEach((dot) => {
        const dist = Math.sqrt((mouseX - dot.x) ** 2 + (mouseY - dot.y) ** 2);
        const scaleFactor =
          dist < radius ? 1 + (maxScale - 1) * (1 - dist / radius) : 1;

        gsap.to(dot.scale, {
          x: scaleFactor,
          y: scaleFactor,
          duration: 0.5,
          ease: "expo.out",
        });
      });
    }
  });

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      app.renderer.resize(container.clientWidth, container.clientHeight);
    }, 50);
  });
}
