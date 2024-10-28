// animations/events/index.js
import { getEvents } from "./eventList.js";
import { renderEvents } from "./eventRenderer.js";

export function eventsPageStarter() {
  initEvents();
  console.log("Events page initialized");
}

async function initEvents() {
  try {
    const events = await getEvents();
    console.log("Events fetched:", events);
    renderEvents(events);

    // Refresh events every 5 minutes
    setInterval(async () => {
      const freshEvents = await getEvents();
      renderEvents(freshEvents);
    }, 5 * 60 * 1000);
  } catch (error) {
    console.error("Failed to initialize events:", error);
  }
}
