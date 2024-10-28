export function renderEvents(events) {
  if (!events || !Array.isArray(events)) {
    console.error("Invalid events data received");
    return;
  }

  const upcomingEvents = events.filter((event) => !event.isPast);
  const pastEvents = events.filter((event) => event.isPast);

  // Render upcoming events
  const upcomingContainer = document.querySelector(
    '[data-events="upcoming-list"]'
  );
  if (upcomingContainer) {
    upcomingContainer.innerHTML = "";
    const upcomingTemplate = document.querySelector(
      '[data-template="upcoming"]'
    );

    if (upcomingTemplate && upcomingEvents.length > 0) {
      upcomingEvents.forEach((event) => {
        renderEvent(event, upcomingTemplate.cloneNode(true), upcomingContainer);
      });
    } else if (upcomingEvents.length === 0) {
      upcomingContainer.innerHTML =
        '<div class="no-events">No upcoming events scheduled</div>';
    }
  }

  // Render past events
  const pastContainer = document.querySelector('[data-events="past-list"]');
  if (pastContainer) {
    pastContainer.innerHTML = "";
    const pastTemplate = document.querySelector('[data-template="past"]');

    if (pastTemplate && pastEvents.length > 0) {
      pastEvents.forEach((event) => {
        renderEvent(event, pastTemplate.cloneNode(true), pastContainer);
      });
    }
  }
}

function renderEvent(event, template, container) {
  try {
    template.style.display = "block";
    template.removeAttribute("data-template");

    const setContent = (selector, content) => {
      const elements = template.querySelectorAll(
        `[data-dynamic="${selector}"]`
      );
      elements.forEach((element) => {
        if (element.tagName === "IMG") {
          element.src = content;
          element.alt = event.name;
          element.onerror = () => {
            element.src = "default-image-url.jpg";
            element.alt = "Event image unavailable";
          };
        } else if (element.tagName === "A") {
          element.href = content;
          element.target = "_blank";
          element.rel = "noopener noreferrer";
        } else {
          element.textContent = content;
        }
      });
    };

    // Update all dynamic content
    setContent("name", event.name);
    setContent("date", event.date);
    setContent("year", event.year);
    setContent("time", `${event.startTime} - ${event.endTime}`);
    setContent("timezone", event.timezone);
    setContent("location", event.location);
    setContent("cover_image", event.imageUrl);
    setContent("register_link", event.url);

    container.appendChild(template);
  } catch (error) {
    console.error("Error rendering event:", error, event);
  }
}
