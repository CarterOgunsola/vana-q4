class APIError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = "APIError";
  }
}

const CACHE_KEY = "lumaEvents";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getEvents() {
  const cachedEvents = getCachedEvents();
  if (cachedEvents) {
    return cachedEvents;
  }

  const events = await fetchEvents();
  setCachedEvents(events);
  return events;
}

function getCachedEvents() {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { timestamp, events } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return events;
    }
  }
  return null;
}

function setCachedEvents(events) {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      timestamp: Date.now(),
      events,
    })
  );
}

async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429) {
        const retryAfter = parseInt(
          response.headers.get("Retry-After") || "60",
          10
        );
        console.warn(`Rate limit exceeded. Retrying in ${retryAfter} seconds.`);
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
      } else {
        return response;
      }
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.warn(`Attempt ${i + 1} failed, retrying...`);
    }
  }
  throw new Error("Max retries reached");
}

async function fetchEvents() {
  const apiKey = import.meta.env.VITE_LUMA_API_KEY;

  try {
    const response = await fetchWithRetry(
      "https://api.lu.ma/public/v1/calendar/list-events",
      {
        headers: {
          "x-luma-api-key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new APIError(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.entries)) {
      throw new Error("Invalid API response structure");
    }

    const now = new Date();
    const processedEvents = data.entries
      .map((entry) => {
        const eventData = entry.event;
        if (!eventData) return null;

        const eventStartDate = new Date(eventData.start_at);
        const eventEndDate = new Date(eventData.end_at);

        // An event is only past if it's ended
        const isPast = eventEndDate < now;

        // Format date components separately
        const dateObj = formatDate(eventStartDate, eventData.timezone);

        return {
          name: eventData.name || "Unnamed Event",
          date: dateObj.dayDate,
          year: dateObj.year,
          location: getEventLocation(eventData),
          startTime: formatTime(eventData.start_at, eventData.timezone),
          endTime: formatTime(eventData.end_at, eventData.timezone),
          url: eventData.url || "#",
          imageUrl: eventData.cover_url || "default-image-url.jpg",
          isPast: isPast,
          description: eventData.description || "",
          timezone: eventData.timezone || "UTC",
          rawStartDate: eventStartDate,
          rawEndDate: eventEndDate,
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        // Sort by past/upcoming first
        if (a.isPast && !b.isPast) return 1;
        if (!a.isPast && b.isPast) return -1;
        // Then sort by start date
        return a.rawStartDate - b.rawStartDate;
      });

    return processedEvents;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

function getEventLocation(event) {
  if (event.geo_address_json) {
    const { address, city, region } = event.geo_address_json;
    const parts = [address, city, region].filter(Boolean);
    return parts.join(", ");
  }

  if (event.meeting_url || event.zoom_meeting_url) {
    return "Virtual Event";
  }

  return "Location TBA";
}

function formatDate(date, timezone) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: timezone || "UTC",
  });

  // This will give us "Sat, Oct 27" format
  const parts = formatter.formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday").value;
  const month = parts.find((part) => part.type === "month").value;
  const day = parts.find((part) => part.type === "day").value;

  const dayDate = `${weekday}, ${month} ${day}`;

  // Format just the year (2024)
  const year = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    timeZone: timezone || "UTC",
  }).format(date);

  return { dayDate, year };
}

function formatTime(dateString, timezone) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone || "UTC",
  }).format(date);
}
