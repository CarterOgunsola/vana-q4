import { gsap } from "gsap";
import SplitType from "split-type";
import { Observe } from "../../utils/observe";
class TextStagger extends Observe {
  constructor(item) {
    // define config
    const config = {
      // observer config
      margin: item.dataset.obsM || "10px",
      threshold: +item.dataset.obsT || 0,
      once: item.dataset.obsOnce === "false" ? false : true,
      // text split config
      aSplit: item.dataset.aSplit || "word",
      aDuration: item.dataset.aDuration ?? 1.9,
      aEach: item.dataset.aEach ?? 0.05,
      aDelay: item.dataset.aDelay ?? 0,
      aEase: item.dataset.aEase ?? "expo.out",
      aFrom: item.dataset.aFrom ?? "start",
    };

    super({ element: item, config });
    this.config = config;
    this.item = item;
    this.animated = this.returnSplit(item);

    this.a = {
      y: "120%",
      x: "0%",
    };

    gsap.set(this.animated, { y: this.a.y });
  }

  returnSplit(el) {
    switch (el.dataset.aSplit) {
      case "char":
        return this.splitChars(this.splitWords(el));
      case "word":
        return this.splitWords(this.splitWords(el));
      case "line":
        return this.splitLines(this.splitLines(el));
      default:
        return this.splitWords(this.splitWords(el));
    }
  }

  splitChars(el) {
    return new SplitType(el, {
      types: "chars",
    }).chars;
  }

  splitWords(el) {
    return new SplitType(el, {
      types: "words",
    }).words;
  }

  splitLines(el) {
    return new SplitType(el, {
      types: "lines",
    }).lines;
  }

  animateIn() {
    this.animation?.kill();
    this.animation = gsap.to(this.animated, {
      y: "0%",
      delay: this.config.aDelay,
      duration: this.config.aDuration,
      stagger: {
        each: this.config.aEach,
        from: this.config.aFrom,
      },
      ease: this.config.aEase,
    });
  }

  animateOut() {
    this.animation?.kill();
    this.animation = gsap.set(this.animated, { y: this.a.y });
  }
}

export class StaggerText {
  constructor(selector) {
    this.selector = selector;
    this.reference = [...document.querySelectorAll(`[${selector}]`)];
    if (!this.reference.length) return;
    this.injectCss();
    this.init();
  }

  init() {
    this.animations = this.reference.map((item) => {
      return new TextStagger(item);
    });
  }

  injectCss() {
    const style = document.createElement("style");
    const styleString = `
      [${this.selector}] > div {
        overflow: hidden;
      }
    `;
    style.textContent = styleString;
    document.head.appendChild(style);
  }
}

// Export the initialization function
export function staggerText(selector = "data-a-split") {
  return new StaggerText(selector);
}
