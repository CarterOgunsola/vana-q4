import { gsap } from "gsap";

// navDropdown/index.js
class NavDropdownController {
  constructor() {
    // DOM Elements
    this.dropdownArea = document.querySelector(
      "[data-element='dropdown-area']"
    );
    this.dropdownWrap = document.querySelector(
      "[data-element='dropdown-wrap']"
    );
    this.dropdownLinks = document.querySelectorAll("[data-dropdown-link]");
    this.dropdownContents = document.querySelectorAll(
      "[data-dropdown-content]"
    );
    this.dropdownOverlay = document.querySelector(
      "[data-element='dropdown-overlay']"
    );

    // State
    this.state = {
      isOpen: false,
      closeTimeout: null,
      resizeTimer: null,
      activeLink: null,
      activeContent: null,
    };

    // Animation settings
    this.animationConfig = {
      openDuration: 0.5,
      closeDuration: 0.4,
      staggerDelay: 0.07,
      closeDelay: 150,
      resizeDelay: 100,
      ease: "power3.out",
    };

    // Bind methods to maintain context
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleEscape = this.handleEscape.bind(this);
    this.handleResize = this.handleResize.bind(this);

    // Initialize
    this.init();
  }

  init() {
    if (!this.dropdownArea || !this.dropdownWrap) {
      console.warn("Required dropdown elements not found");
      return;
    }
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Dropdown links
    this.dropdownLinks.forEach((link) => {
      link.addEventListener("mouseenter", (e) => this.handleLinkHover(e));
    });

    // Dropdown area
    this.dropdownArea.addEventListener("mouseenter", () =>
      this.clearCloseTimeout()
    );

    // Global listeners
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("keydown", this.handleEscape);
    window.addEventListener("resize", this.handleResize);
  }

  handleLinkHover(event) {
    const link = event.target;
    const targetDropdown = document.querySelector(
      `[data-dropdown-content='${link.getAttribute("data-dropdown-link")}']`
    );
    this.openDropdown(link, targetDropdown);
  }

  openDropdown(activeLink, activeContent) {
    if (!activeContent || !activeLink) return;

    this.clearCloseTimeout();
    this.state.activeLink = activeLink;
    this.state.activeContent = activeContent;

    this.setVariables(activeLink, activeContent);
    this.calculateHeights(activeContent);
    this.animateOpen(activeContent);
  }

  closeDropdown() {
    if (!this.state.isOpen) return;

    this.setVariables(null, null);
    this.animateClose();
  }

  calculateHeights(activeContent) {
    if (!activeContent) return;

    const contentHeight = activeContent.scrollHeight;
    gsap.to(this.dropdownWrap, {
      height: contentHeight,
      duration: this.animationConfig.openDuration,
      ease: this.animationConfig.ease,
    });
  }

  animateOpen(activeContent) {
    const innerLinks = activeContent.querySelectorAll(
      "[data-element='dropdown-inner-link']"
    );

    gsap.fromTo(
      innerLinks,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: this.animationConfig.staggerDelay,
        ease: this.animationConfig.ease,
      }
    );

    gsap.to(this.dropdownOverlay, {
      opacity: 1,
      duration: 0.3,
      ease: this.animationConfig.ease,
    });
  }

  animateClose() {
    gsap.to(this.dropdownWrap, {
      height: 0,
      duration: this.animationConfig.closeDuration,
      ease: this.animationConfig.ease,
      onComplete: () => {
        this.state.isOpen = false;
      },
    });

    gsap.to(this.dropdownOverlay, {
      opacity: 0,
      duration: this.animationConfig.closeDuration,
      ease: this.animationConfig.ease,
    });
  }

  setVariables(activeLink, activeContent) {
    this.dropdownLinks.forEach((link) => link.classList.remove("is--active"));
    this.dropdownContents.forEach((content) =>
      content.classList.remove("is--active")
    );

    if (activeLink && activeContent) {
      activeLink.classList.add("is--active");
      activeContent.classList.add("is--active");
      this.dropdownWrap.setAttribute("data-state", "active");
      this.dropdownOverlay.setAttribute("data-state", "active");
      this.dropdownOverlay.classList.add("is--active");
      this.state.isOpen = true;
    } else {
      this.dropdownWrap.removeAttribute("data-state");
      this.dropdownOverlay.removeAttribute("data-state");
      this.dropdownOverlay.classList.remove("is--active");
      this.state.isOpen = false;
      this.state.activeLink = null;
      this.state.activeContent = null;
    }
  }

  shouldKeepOpen(event) {
    const isOverDropdownArea = this.dropdownArea.contains(event.target);
    const isOverDropdownWrap = this.dropdownWrap.contains(event.target);
    return isOverDropdownArea || isOverDropdownWrap;
  }

  handleMouseMove(event) {
    if (!this.state.isOpen) return;

    if (!this.shouldKeepOpen(event)) {
      if (!this.state.closeTimeout) {
        this.state.closeTimeout = setTimeout(() => {
          this.closeDropdown();
          this.state.closeTimeout = null;
        }, this.animationConfig.closeDelay);
      }
    } else {
      this.clearCloseTimeout();
    }
  }

  clearCloseTimeout() {
    if (this.state.closeTimeout) {
      clearTimeout(this.state.closeTimeout);
      this.state.closeTimeout = null;
    }
  }

  handleEscape(event) {
    if (event.key === "Escape" && this.state.isOpen) {
      this.closeDropdown();
    }
  }

  handleResize() {
    clearTimeout(this.state.resizeTimer);
    this.state.resizeTimer = setTimeout(() => {
      if (this.state.activeContent && this.state.isOpen) {
        this.calculateHeights(this.state.activeContent);
      }
    }, this.animationConfig.resizeDelay);
  }

  destroy() {
    // Clean up event listeners
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("keydown", this.handleEscape);
    window.removeEventListener("resize", this.handleResize);

    // Clear any pending timeouts
    this.clearCloseTimeout();
    if (this.state.resizeTimer) {
      clearTimeout(this.state.resizeTimer);
    }
  }
}

// Export the function that creates an instance
export function NavDropdown() {
  return new NavDropdownController();
}
