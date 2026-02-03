const ICS_URL = "https://outlook.office365.com/owa/calendar/3b10b637c9cc461b866aa4d8e74990d1@asdmr.hn/6fa0c3b82d7140fbb8bbfe5fa572a9899583237678018907306/calendar.ics";
const ICS_PROXY_URL = "https://events-ics-proxy.daniel-contreras.workers.dev";

const EVENTS_CONTAINER_ID = "upcoming-events";

function unfoldIcs(text) {
  return text.replace(/\r?\n[ \t]/g, "");
}

function decodeIcsValue(value) {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\")
    .trim();
}

function getIcsValue(vevent, key) {
  const regex = new RegExp("^" + key + "(?:;[^:]*)?:([^\\n]*)", "m");
  const match = vevent.match(regex);
  if (!match) return "";
  return decodeIcsValue(match[1]);
}

function extractFacebookUrl(description) {
  const match = description.match(/https:\/\/www\.facebook\.com\/events\/\d+\/?/);
  return match ? match[0] : "";
}

function parseIcsDate(value) {
  if (!value) return null;
  const isUtc = value.endsWith("Z");
  const clean = value.replace(/Z$/, "");
  const dateOnly = clean.length === 8;
  const year = Number(clean.slice(0, 4));
  const month = Number(clean.slice(4, 6));
  const day = Number(clean.slice(6, 8));

  if (dateOnly) {
    return new Date(year, month - 1, day);
  }

  const timePart = clean.split("T")[1] || "000000";
  const hours = Number(timePart.slice(0, 2));
  const minutes = Number(timePart.slice(2, 4));
  const seconds = Number(timePart.slice(4, 6));

  if (isUtc) {
    return new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
  }

  return new Date(year, month - 1, day, hours, minutes, seconds);
}

function isAllDayEvent(dtstart) {
  return dtstart && dtstart.length === 8;
}

function formatMonth(date) {
  return date
    .toLocaleString(undefined, { month: "short" })
    .toUpperCase();
}

function formatDay(date) {
  return String(date.getDate()).padStart(2, "0");
}

function formatTimeRange(startDate, endDate, allDay, hasEnd) {
  if (allDay && !hasEnd) return "All day";
  if (allDay) return "All day";
  const options = { hour: "numeric", minute: "2-digit" };
  const startTime = startDate.toLocaleTimeString(undefined, options);
  if (!endDate) return startTime;
  const endTime = endDate.toLocaleTimeString(undefined, options);
  return `${startTime} - ${endTime}`;
}

function parseIcsEvents(icsText) {
  const text = unfoldIcs(icsText);
  const blocks = text.split("BEGIN:VEVENT").slice(1);
  const events = [];

  blocks.forEach((block) => {
    const endIndex = block.indexOf("END:VEVENT");
    if (endIndex === -1) return;
    const vevent = block.slice(0, endIndex);

    const dtstart = getIcsValue(vevent, "DTSTART");
    if (!dtstart) return;

    const dtend = getIcsValue(vevent, "DTEND");
    const summary = getIcsValue(vevent, "SUMMARY") || "Untitled Event";
    const location = getIcsValue(vevent, "LOCATION") || "";
    const description = getIcsValue(vevent, "DESCRIPTION") || "";
    const facebookUrl = extractFacebookUrl(description);

    events.push({
      dtstart,
      dtend,
      summary,
      location,
      description,
      facebookUrl,
    });
  });

  return events;
}

function buildEventCard(event) {
  const card = document.createElement("article");
  card.className = "event-card";

  const date = document.createElement("div");
  date.className = "event-date";

  const month = document.createElement("span");
  month.className = "event-month";
  month.textContent = formatMonth(event.startDate);

  const day = document.createElement("span");
  day.className = "event-day";
  day.textContent = formatDay(event.startDate);

  date.appendChild(month);
  date.appendChild(day);

  const details = document.createElement("div");
  details.className = "event-details";

  const title = document.createElement("h3");
  title.className = "event-title";
  title.textContent = event.summary;

  const time = document.createElement("p");
  time.className = "event-time";
  time.innerHTML = `<i class="fa-regular fa-clock"></i> ${event.timeLabel}`;

  const location = document.createElement("p");
  location.className = "event-location";
  location.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${event.location || "Location TBA"}`;

  const link = document.createElement("a");
  link.className = "event-link";
  link.textContent = "View details \u2192";

  if (event.facebookUrl) {
    link.href = event.facebookUrl;
    link.target = "_blank";
    link.rel = "noopener";
    card.addEventListener("click", () => {
      window.open(event.facebookUrl, "_blank", "noopener");
    });
  } else {
    link.href = "#";
    link.classList.add("is-disabled");
    link.setAttribute("aria-disabled", "true");
    card.classList.add("is-disabled");
    link.addEventListener("click", (e) => e.preventDefault());
  }

  details.appendChild(title);
  details.appendChild(time);
  details.appendChild(location);
  details.appendChild(link);

  card.appendChild(date);
  card.appendChild(details);

  return card;
}

function renderEvents(container, events) {
  container.innerHTML = "";

  if (!events.length) {
    const empty = document.createElement("div");
    empty.className = "events-empty";
    empty.textContent = "No upcoming events.";
    container.appendChild(empty);
    return;
  }

  events.forEach((event) => {
    container.appendChild(buildEventCard(event));
  });
}

async function initUpcomingEvents() {
  const container = document.getElementById(EVENTS_CONTAINER_ID);
  if (!container) return;

  try {
    if (!ICS_PROXY_URL || ICS_PROXY_URL === "PASTE_CLOUDFLARE_WORKER_URL_HERE") {
      throw new Error("Missing ICS proxy URL");
    }
    if (!ICS_URL || ICS_URL === "PASTE_ICS_URL_HERE") {
      throw new Error("Missing ICS URL");
    }

    const proxyRequestUrl = `${ICS_PROXY_URL}?url=${encodeURIComponent(ICS_URL)}`;
    const response = await fetch(proxyRequestUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to load ICS feed");
    const text = await response.text();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const upcoming = parseIcsEvents(text)
      .map((event) => {
        const startDate = parseIcsDate(event.dtstart);
        const endDate = parseIcsDate(event.dtend);
        const allDay = isAllDayEvent(event.dtstart);
        const timeLabel = formatTimeRange(startDate, endDate, allDay, Boolean(event.dtend));

        return {
          ...event,
          startDate,
          endDate,
          allDay,
          timeLabel,
        };
      })
      .filter((event) => {
        if (!event.startDate) return false;
        if (event.allDay) {
          return event.startDate >= todayStart;
        }
        return event.startDate >= now;
      })
      .sort((a, b) => a.startDate - b.startDate)
      .slice(0, 3);

    renderEvents(container, upcoming);
  } catch (error) {
    renderEvents(container, []);
  }
}

document.addEventListener("DOMContentLoaded", initUpcomingEvents);
