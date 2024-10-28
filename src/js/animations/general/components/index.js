import { initNavButtons } from "./navButton.js";
import { NavDropdown } from "./navDropdown/index.js";

export function useComponents() {
  initNavButtons();
  NavDropdown();

  console.log(useComponents);
}
