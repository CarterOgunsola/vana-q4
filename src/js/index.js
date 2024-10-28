import "../styles/index.css";
import { initPageRouter } from "./utils/pageRouter";

document.addEventListener("DOMContentLoaded", () => {
  initPageRouter();
});

console.log("Hello, Vite!");

// import "../styles/index.css";
// import { initPageRouter } from "./utils/pageRouter";
// import { createPolkaDots } from "./animations/general/components/polkaDot";

// const polkaDotContainers = document.querySelectorAll(
//   '[data-canvas="polka-dot"]'
// );

// document.addEventListener("DOMContentLoaded", () => {
//   initPageRouter();

//   if (polkaDotContainers.length === 0) {
//     console.warn("No containers found with data-canvas='polka-dot'");
//   } else {
//     polkaDotContainers.forEach(async (container) => {
//       try {
//         await createPolkaDots(container);
//       } catch (error) {
//         console.error("Failed to initialize polka dot effect:", error);
//       }
//     });
//   }
// });
