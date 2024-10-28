import { useGeneral } from "../animations/general/index";
import { homePageStarter } from "../animations/home/index";
import { aboutPageStarter } from "../animations/about/index";
import { eventsPageStarter } from "../animations/events";

// Initializes page-specific animations based on the data-page-name attribute.
// Ensure the main page wrapper has a unique class with data-page-name attribute
// to avoid animation code leakage across different pages.

export function initPageRouter() {
  const pageWrapper = document.querySelector("[data-page-name]");

  if (!pageWrapper) {
    console.warn("No data-page-name attribute found on the page wrapper.");
    return;
  }

  const pageName = pageWrapper.getAttribute("data-page-name");

  // Initialize general animations first
  useGeneral();

  // Mapping of page names to their respective starter functions
  const pageStarters = {
    home: homePageStarter,
    about: aboutPageStarter,
    events: eventsPageStarter,
    // Add additional page starters here
  };

  const starterFunction = pageStarters[pageName];
  if (starterFunction) {
    starterFunction();
  } else {
    console.warn(`No specific animations found for page: ${pageName}`);
  }
}
