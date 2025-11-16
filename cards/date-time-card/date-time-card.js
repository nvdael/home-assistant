// ------------------------------------------------------------
// Date‑Time Card – Home Assistant Custom Lovelace Card
// Author: Nathan van Dael
// ------------------------------------------------------------

// Importeer alleen uit de moderne 'lit' package.
// CDN‑link werkt zonder extra installatie, maar je kunt ook een lokaal pakket gebruiken.
import { LitElement, html, css } from "https://cdn.jsdelivr.net/npm/lit@2.8.0/+esm";

/* ------------------------------------------------------------------
   Helper‑arrays voor Nederlandse dag‑ en maandnamen
------------------------------------------------------------------- */
const DUTCH_DAYS = [
  "Zondag", "Maandag", "Dinsdag", "Woensdag",
  "Donderdag", "Vrijdag", "Zaterdag"
];
const DUTCH_MONTHS = [
  "Januari", "Februari", "Maart", "April", "Mei", "Juni",
  "Juli", "Augustus", "September", "Oktober", "November", "December"
];

/* ------------------------------------------------------------------
   Custom Element definitie
------------------------------------------------------------------- */
class DateTimeCard extends LitElement {
  /* ------------------- Reactieve eigenschappen ------------------- */
  static properties = {
    // we houden een Date‑object bij; elke seconde wordt het vernieuwd
    _now: { state: true },
  };

  /* -------------------------- Styling -------------------------- */
  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      background: var(--card-background-color, #fff);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, none);
      font-family: var(--paper-font-body1_-_font-family, "Roboto", sans-serif);
      color: var(--primary-text-color);
    }
    .time {
      font-size: 2.2rem;
      font-weight: 600;
    }
    .date {
      margin-top: 0.4rem;
      font-size: 1.2rem;
      opacity: 0.85;
    }
  `;

  /* ---------------------- Lifecycle hooks ---------------------- */
  constructor() {
    super();
    this._now = new Date();               // initieel moment
  }

  connectedCallback() {
    super.connectedCallback();
    // Elke seconde bijwerken zodat de klok live loopt
    this._timer = setInterval(() => (this._now = new Date()), 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._timer);
  }

  /* -------------------------- Helpers -------------------------- */
  _formatTime(date) {
    const pad = n => String(n).padStart(2, "0");
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  _formatDate(date) {
    const dayName = DUTCH_DAYS[date.getDay()];
    const dayNum  = date.getDate();
    const month   = DUTCH_MONTHS[date.getMonth()];
    return `${dayName} ${dayNum} ${month}`;
  }

  /* --------------------------- Render -------------------------- */
  render() {
    const timeStr = this._formatTime(this._now);
    const dateStr = this._formatDate(this._now);
    return html`
      <div class="time">${timeStr}</div>
      <div class="date">${dateStr}</div>
    `;
  }
}

/* ------------------- Registratie (éénmalig) ------------------- */
customElements.define("date-time-card", DateTimeCard);