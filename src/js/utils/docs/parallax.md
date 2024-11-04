# Parallax & Smooth Scroll Setup Guide

## HTML Structure

### Parallax Elements

Use the `data-parallax` attribute to specify elements that will have a parallax effect. You can adjust the speed using `data-parallax-speed`.

```html
<!-- For parallax elements -->
<div data-parallax data-parallax-speed="0.5">Parallax content</div>

<!-- For elements that should prevent smooth scroll -->
<div data-lenis-prevent>Regular scroll content</div>
```

---

## Parallax Initialization

### File: `src/js/animations/parallaxInit.js`

```javascript
import { createParallax } from "../../utils/parallax";

export function initParallaxElements() {
  // Select all elements with the data-parallax attribute
  const parallaxElements = document.querySelectorAll("[data-parallax]");

  // Apply the parallax effect to each element
  parallaxElements.forEach((element) => {
    const speed = element.dataset.parallaxSpeed || 0.5; // Default speed is 0.5
    createParallax(element, { speed });
  });
}
```

---

## Notes

- **Parallax Content**: Use `data-parallax` to enable parallax effects. Adjust the speed using `data-parallax-speed`.
- **Prevent Smooth Scroll**: Use `data-lenis-prevent` on elements that should not have smooth scrolling.
- **Initialization**: Ensure to call `initParallaxElements()` in your main JavaScript file to activate the effects.

---
