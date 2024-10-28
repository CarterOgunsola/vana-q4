import { gsap } from "gsap";

export function NavDropdown() {
  const navWrap = document.querySelector("[data-element='header-wrap']");
  const dropdownWrap = document.querySelector("[data-element='dropdown-wrap']");
  const dropdownArea = document.querySelector("[data-element='dropdown-area']");
  const dropdownLinks = document.querySelectorAll("[data-dropdown-link]");
  const dropdownContents = document.querySelectorAll("[data-dropdown-content]");
  const dropdownInnerLinks = document.querySelectorAll(
    "[data-element='dropdown-inner-link']"
  );
  const dropdownOverlay = document.querySelector(
    "[data-element='dropdown-overlay']"
  );

  // Calculate and update dropdown wrap height dynamically
  const calculateHeights = (activeContent) => {
    const contentHeight = activeContent.scrollHeight;
    gsap.to(dropdownWrap, {
      height: contentHeight,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  // Set or reset variables based on active/inactive states
  const setVariables = (activeLink, activeContent) => {
    dropdownLinks.forEach((link) => link.classList.remove("is--active"));
    dropdownContents.forEach((content) =>
      content.classList.remove("is--active")
    );

    if (activeLink && activeContent) {
      activeLink.classList.add("is--active");
      activeContent.classList.add("is--active");
      dropdownWrap.setAttribute("data-state", "active");
      dropdownOverlay.setAttribute("data-state", "active");
      dropdownOverlay.classList.add("is--active");
    } else {
      dropdownWrap.removeAttribute("data-state");
      dropdownOverlay.removeAttribute("data-state");
      dropdownOverlay.classList.remove("is--active");
    }
  };

  // Open dropdown with staggered animations
  const openDropdown = (activeLink, activeContent) => {
    setVariables(activeLink, activeContent);
    calculateHeights(activeContent);

    // Stagger in dropdown inner links
    const innerLinks = activeContent.querySelectorAll(
      "[data-element='dropdown-inner-link']"
    );
    gsap.fromTo(
      innerLinks,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: "power3.out" }
    );

    // Animate overlay
    gsap.to(dropdownOverlay, { opacity: 1, duration: 0.3, ease: "power3.out" });
  };

  // Close dropdown when mouse leaves
  const closeDropdown = () => {
    setVariables(null, null);
    gsap.to(dropdownWrap, { height: 0, duration: 0.4, ease: "power3.inOut" });
    gsap.to(dropdownOverlay, { opacity: 0, duration: 0.4, ease: "power3.out" });
  };

  // Event listener for hover on dropdown links
  dropdownLinks.forEach((link) => {
    link.addEventListener("mouseenter", (e) => {
      const targetDropdown = document.querySelector(
        `[data-dropdown-content='${link.getAttribute("data-dropdown-link")}']`
      );
      openDropdown(link, targetDropdown);
    });
  });

  // Close dropdown when mouse leaves dropdownWrap
  dropdownWrap.addEventListener("mouseleave", closeDropdown);

  // Escape key to close dropdown
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDropdown();
    }
  });

  // Handle window resize to recalculate heights
  window.addEventListener("resize", () => {
    const activeContent = document.querySelector(
      "[data-dropdown-content].is--active"
    );
    if (activeContent) calculateHeights(activeContent);
  });
}
