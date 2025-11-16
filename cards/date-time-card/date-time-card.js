// ------------------------------------------------------------
// Date‑Time Card – Home Assistant Custom Lovelace Card
// ------------------------------------------------------------

import { LitElement, html, css } from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";

/**
 * Helper: Nederlandse namen van dagen en maanden
 */
const DUTCH_DAYS = [
  "Zondag", "Maandag", "Dinsdag", "Woensdag",
  "Donderdag", "Vrijdag", "Zaterdag"
];
const DUTCH_MONTHS = [
  "Januari", "Februari", "Maart", "April", "Mei", "Juni",
  "Juli", "Augustus", "September", "Oktober", "November", "December"
];

class DateTimeCard extends LitElement {
  static properties = {
    /** Houdt de huidige datum/tijd bij – wordt iedere seconde geüpdatet */
    _now: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      font-family: var(--paper-font-body1_-_font-family, "Roboto", sans-serif);
      color: var(--primary-text-color);
      background: var(--card-background-color, #fff);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, none);
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

  constructor() {
    super();
    this._now = new Date();
  }

  connectedCallback() {
    super.connectedCallback();
    // Update elke seconde zodat de klok live blijft
    this._timer = setInterval(() => (this._now = new Date()), 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._timer);
  }

  /**
   * Formatteer tijd als HH:mm (24‑uur)
   */
  _formatTime(date) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  /**
   * Formatteer datum als “Dagnaam dd Maandnaam”
   */
  _formatDate(date) {
    const dayName = DUTCH_DAYS[date.getDay()];
    const dayNum = date.getDate();
    const monthName = DUTCH_MONTHS[date.getMonth()];
    return `${dayName} ${dayNum} ${monthName}`;
  }

  render() {
    const timeStr = this._formatTime(this._now);
    const dateStr = this._formatDate(this._now);

    return html`
      <div class="time">${timeStr}</div>
      <div class="date">${dateStr}</div>
    `;
  }
}

/* Register the card so Home Assistant can find it */
customElements.define("date-time-card", DateTimeCard);