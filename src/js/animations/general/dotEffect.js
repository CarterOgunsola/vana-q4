import gsap from "gsap";
import { Pane } from "tweakpane";

const enableTweakpane = false;

export const dotEffect = (canvasSelector = "[data-canvas]") => {
  const element = document.querySelector(canvasSelector);
  if (!element || !(element instanceof HTMLCanvasElement)) {
    console.warn(
      `Valid canvas element "${canvasSelector}" not found. dotEffect initialization skipped.`
    );
    return () => {};
  }

  const canvas = element;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) {
    console.error(
      "Failed to get canvas context. dotEffect initialization skipped."
    );
    return () => {};
  }

  const CONFIG = {
    dots: {
      size: 800,
      spacing: 50,
      colors: { normal: "#1B041F", hover: "#296B29" },
    },
    mouse: {
      influence: 40,
      pushStrength: 10,
      speedLimit: 15,
      showTrails: false,
    },
    animation: { moveAway: 0.6, returnBack: 1.3, bounceAmount: 0.5 },
    canvas: { background: "#000000", resizeDelay: 100 },
  };

  const settings = {
    get radius() {
      return window.innerWidth / CONFIG.dots.size;
    },
    get space() {
      return window.innerWidth / CONFIG.dots.spacing;
    },
    get cols() {
      return Math.ceil(window.innerWidth / (this.radius * 2 + this.space)) + 1;
    },
    get rows() {
      return Math.ceil(window.innerHeight / (this.radius * 2 + this.space)) + 1;
    },
    colors: {
      background: CONFIG.canvas.background,
      dot: CONFIG.dots.colors.normal,
      hover: CONFIG.dots.colors.hover,
    },
    animation: {
      duration: CONFIG.animation.moveAway,
      returnDuration: CONFIG.animation.returnBack,
      elasticity: CONFIG.animation.bounceAmount,
    },
  };

  const options = {
    threshold: CONFIG.mouse.influence,
    radius: CONFIG.mouse.pushStrength,
    maxSpeed: CONFIG.mouse.speedLimit,
    trail: CONFIG.mouse.showTrails,
  };

  const dots = [];

  const mouse = {
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    velocity: { x: 0, y: 0 },
    hoverThreshold: window.innerWidth / options.threshold,
    isActive: false,
  };

  class Dot {
    constructor(x, y, radius) {
      this.params = {
        x,
        y,
        radius,
        x2: x,
        y2: y,
        scale: 1,
        color: settings.colors.dot,
        alpha: 1,
      };
      this.velocity = { x: 0, y: 0 };
    }
    update() {
      const distanceFromMouse = getDistanceFromMouse(
        this.params.x,
        this.params.y,
        this.params.radius
      );
      const isInRange = distanceFromMouse <= mouse.hoverThreshold;
      if (isInRange && mouse.isActive) {
        const dx = mouse.x - this.params.x;
        const dy = mouse.y - this.params.y;
        const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy));
        const targetX =
          this.params.x -
          (dx / distance) * options.radius -
          mouse.velocity.x * 2;
        const targetY =
          this.params.y -
          (dy / distance) * options.radius -
          mouse.velocity.y * 2;
        gsap.to(this.params, {
          duration: settings.animation.duration,
          x2: targetX,
          y2: targetY,
          scale: 1.2,
          color: settings.colors.hover,
          ease: "power2.out",
        });
      } else {
        gsap.to(this.params, {
          duration: settings.animation.returnDuration,
          x2: this.params.x,
          y2: this.params.y,
          scale: 1,
          color: settings.colors.dot,
          ease: `elastic.out(1,${settings.animation.elasticity})`,
        });
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(
        this.params.x2,
        this.params.y2,
        this.params.radius * this.params.scale,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = this.params.color;
      ctx.fill();
      if (options.trail) {
        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        ctx.moveTo(this.params.x, this.params.y);
        ctx.lineTo(this.params.x2, this.params.y2);
        ctx.strokeStyle = this.params.color;
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  const setCanvasSize = () => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  };

  const getDistanceFromMouse = (x, y, radius) => {
    const dx = mouse.x - (x + radius);
    const dy = mouse.y - (y + radius);
    return Math.floor(Math.sqrt(dx * dx + dy * dy)) - Math.round(radius);
  };

  const createDots = () => {
    dots.length = 0;
    for (let i = 0; i < settings.cols; i++) {
      const x = i * (settings.space + settings.radius * 2) + settings.radius;
      for (let j = 0; j < settings.rows; j++) {
        const y = j * (settings.space + settings.radius * 2) + settings.radius;
        dots.push(new Dot(x, y, settings.radius));
      }
    }
  };

  let animationFrame;
  const animate = () => {
    mouse.velocity.x = mouse.x - mouse.prevX;
    mouse.velocity.y = mouse.y - mouse.prevY;
    ctx.fillStyle = settings.colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    dots.forEach((dot) => {
      dot.update();
      dot.draw();
    });
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
    animationFrame = requestAnimationFrame(animate);
  };

  let pane;
  if (enableTweakpane) {
    try {
      pane = new Pane();
      const setupPane = () => {
        const dotsFolder = pane.addFolder({ title: "Dots" });
        dotsFolder.addBinding(CONFIG.dots, "size", {
          min: 500,
          max: 3000,
          step: 1,
        });
        dotsFolder.addBinding(CONFIG.dots, "spacing", {
          min: 20,
          max: 200,
          step: 1,
        });
        dotsFolder.addBinding(CONFIG.dots.colors, "normal", { view: "color" });
        dotsFolder.addBinding(CONFIG.dots.colors, "hover", { view: "color" });

        const mouseFolder = pane.addFolder({ title: "Mouse" });
        mouseFolder.addBinding(CONFIG.mouse, "influence", {
          min: 1,
          max: 50,
          step: 1,
        });
        mouseFolder.addBinding(CONFIG.mouse, "pushStrength", {
          min: 1,
          max: 50,
          step: 1,
        });
        mouseFolder.addBinding(CONFIG.mouse, "showTrails");

        const animationFolder = pane.addFolder({ title: "Animation" });
        animationFolder.addBinding(CONFIG.animation, "moveAway", {
          min: 0.1,
          max: 2,
          step: 0.1,
        });
        animationFolder.addBinding(CONFIG.animation, "returnBack", {
          min: 0.1,
          max: 2,
          step: 0.1,
        });
        animationFolder.addBinding(CONFIG.animation, "bounceAmount", {
          min: 0,
          max: 1,
          step: 0.1,
        });

        pane.on("change", (ev) => {
          settings.colors.dot = CONFIG.dots.colors.normal;
          settings.colors.hover = CONFIG.dots.colors.hover;
          settings.animation.duration = CONFIG.animation.moveAway;
          settings.animation.returnDuration = CONFIG.animation.returnBack;
          settings.animation.elasticity = CONFIG.animation.bounceAmount;
          options.threshold = CONFIG.mouse.influence;
          options.radius = CONFIG.mouse.pushStrength;
          options.maxSpeed = CONFIG.mouse.speedLimit;
          options.trail = CONFIG.mouse.showTrails;
          mouse.hoverThreshold = window.innerWidth / CONFIG.mouse.influence;
          createDots();
        });
      };
      setupPane();
    } catch (error) {
      console.error("Failed to initialize Tweakpane:", error);
    }
  }

  setCanvasSize();
  createDots();
  animate();

  const handleMouseMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.isActive = true;
  };

  const handleMouseOut = () => {
    mouse.isActive = false;
  };

  let resizeTimeout;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      mouse.hoverThreshold = window.innerWidth / options.threshold;
      setCanvasSize();
      createDots();
    }, CONFIG.canvas.resizeDelay);
  };

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseout", handleMouseOut);
  window.addEventListener("resize", handleResize);

  const cleanup = () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseout", handleMouseOut);
    window.removeEventListener("resize", handleResize);
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    if (pane) {
      pane.dispose();
    }
  };

  return cleanup;
};
