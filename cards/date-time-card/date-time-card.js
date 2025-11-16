// ------------------------------------------------------------
// Date‑Time Card – Home Assistant Custom Lovelace Card
// Author: Nathan van Dael
// ------------------------------------------------------------

import { LitElement, html, css } from "https://cdn.jsdelivr.net/npm/lit@2.8.0/+esm";

/* ---------- Nederlandse dag‑ en maandnamen ---------- */
const DUTCH_DAYS = [
  "Zondag", "Maandag", "Dinsdag", "Woensdag",
  "Donderdag", "Vrijdag", "Zaterdag"
];
const DUTCH_MONTHS = [
  "Januari", "Februari", "Maart", "April", "Mei", "Juni",
  "Juli", "Augustus", "September", "Oktober", "November", "December"
];

/* ------------------- Custom Element ------------------- */
class DateTimeCard extends LitElement {
  /* ------------------- Reactieve eigenschappen ------------------- */
  static properties = {
    // interne datum/tijd, wordt elke seconde vernieuwd
    _now:    { state: true },
    // configuratie‑object dat Home Assistant via setConfig() doorgeeft
    _config: { state: false },
  };

  /* --------------------------- Styling -------------------------- */
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
    .title { font-size: 1.4rem; font-weight: 600; margin-bottom: 0.4rem; }
    .time  { font-size: 2.2rem; font-weight: 600; }
    .date  { margin-top: 0.4rem; font-size: 1.2rem; opacity: 0.85; }
  `;

  /* -------------------------- Constructor ------------------------ */
  constructor() {
    super();
    this._now    = new Date();   // startwaarde
    this._config = {};           // lege fallback‑config
  }

  /* ---------------------- Lifecycle hooks ---------------------- */
  connectedCallback() {
    super.connectedCallback();
    // elke seconde updaten → live klok
    this._timer = setInterval(() => (this._now = new Date()), 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._timer);
  }

  /* -------------------------- setConfig ------------------------
   * Home Assistant roept deze methode aan zodra de kaart in de UI
   * wordt geplaatst of wanneer de gebruiker de configuratie wijzigt.
   *
   * @param {object} config  –  Het configuratie‑object uit de YAML/GUI.
   */
  setConfig(config) {
    // Optionele validatie – je kunt hier vereiste keys afdwingen
    if (typeof config !== "object") {
      throw new Error("Invalid configuration for date-time-card");
    }
    this._config = config;
  }

  /* -------------------------- Helpers -------------------------- */
  _pad(num) { return String(num).padStart(2, "0"); }

  _formatTime(date) {
    return `${this._pad(date.getHours())}:${this._pad(date.getMinutes())}`;
  }

  _formatDate(date) {
    const day   = DUTCH_DAYS[date.getDay()];
    const month = DUTCH_MONTHS[date.getMonth()];
    const dayNr = date.getDate();
    return `${day} ${dayNr} ${month}`;
  }

  /* --------------------------- Render -------------------------- */
  render() {
    const time = this._formatTime(this._now);
    const date = this._formatDate(this._now);

    // Optioneel: een titel uit de configuratie (bijv. title: "Mijn klok")
    const title = this._config.title
      ? html`<div class="title">${this._config.title}</div>`
      : "";

    return html`
      ${title}
      <div class="time">${time}</div>
      <div class="date">${date}</div>
    `;
  }
}

/* ------------------- Registratie (éénmalig) ------------------- */
customElements.define("date-time-card", DateTimeCard);