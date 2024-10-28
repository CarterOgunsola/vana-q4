import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export class NavButton {
  constructor(button) {
    this.button = button;
    this.buttonText = this.button.querySelector(
      "[data-element='nav-button-text']"
    );
    this.split = new SplitText(this.buttonText, { types: "chars" });
    this.init();
  }

  init() {
    this.button.addEventListener("mouseenter", this.animateIn.bind(this));
    this.button.addEventListener("mouseleave", this.animateOut.bind(this));
  }

  animateIn() {
    gsap.to(this.split.chars, {
      opacity: 0.2,
      stagger: {
        each: 0.03,
        onComplete: function () {
          gsap.to(this.targets(), { opacity: 1, duration: 0.5 });
        },
      },
      duration: 0.1,
    });
  }

  animateOut() {
    gsap.to(this.split.chars, {
      opacity: 1,
      duration: 0.2,
    });
  }
}

// Initialize buttons with the NavButton class
export function initNavButtons() {
  const buttons = document.querySelectorAll("[data-element='nav-button']");
  buttons.forEach((button) => new NavButton(button));
}
