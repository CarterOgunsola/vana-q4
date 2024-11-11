import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export class NavButton {
  static ANIMATION_CONFIG = {
    baseStagger: 0.03,
    minStagger: 0.01,
    reductionFactor: 0.0005,
    fadeInDuration: 0.5,
    fadeOutDuration: 0.2,
    initialOpacity: 0.2,
    initialDuration: 0.1,
  };

  constructor(button) {
    if (!(button instanceof Element)) {
      throw new Error("NavButton requires a valid DOM element");
    }

    this.button = button;
    this.buttonText = this.button.querySelector(
      "[data-element='nav-button-text']"
    );

    if (!this.buttonText) {
      throw new Error("Required text element not found");
    }

    this.split = new SplitText(this.buttonText, { types: "chars" });
    this.boundAnimateIn = this.animateIn.bind(this);
    this.boundAnimateOut = this.animateOut.bind(this);

    this.init();
  }

  init() {
    this.button.addEventListener("mouseenter", this.boundAnimateIn);
    this.button.addEventListener("mouseleave", this.boundAnimateOut);
  }

  destroy() {
    this.button.removeEventListener("mouseenter", this.boundAnimateIn);
    this.button.removeEventListener("mouseleave", this.boundAnimateOut);
    this.split.revert();
  }

  getStaggerTime() {
    const { baseStagger, minStagger, reductionFactor } =
      NavButton.ANIMATION_CONFIG;
    return Math.max(
      minStagger,
      baseStagger - this.split.chars.length * reductionFactor
    );
  }

  animateIn() {
    const { fadeInDuration, initialOpacity, initialDuration } =
      NavButton.ANIMATION_CONFIG;
    const staggerTime = this.getStaggerTime();

    gsap.to(this.split.chars, {
      opacity: initialOpacity,
      stagger: {
        each: staggerTime,
        onComplete: function () {
          gsap.to(this.targets(), {
            opacity: 1,
            duration: fadeInDuration,
          });
        },
      },
      duration: initialDuration,
    });
  }

  animateOut() {
    const { fadeOutDuration } = NavButton.ANIMATION_CONFIG;

    gsap.to(this.split.chars, {
      opacity: 1,
      duration: fadeOutDuration,
    });
  }
}

export function initNavButtons() {
  const buttons = document.querySelectorAll("[data-element='nav-button']");
  return Array.from(buttons).map((button) => new NavButton(button));
}
