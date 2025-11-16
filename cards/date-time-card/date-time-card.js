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
  static properties = {
    // interne datum/tijd, wordt elke seconde vernieuwd
    _now: { state: true },
  };

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
    .time { font-size: 2.2rem; font-weight: 600; }
    .date { margin-top: 0.4rem; font-size: 1.2rem; opacity: 0.85; }
  `;

  constructor() {
    super();
    this._now = new Date();                 // startwaarde
  }

  connectedCallback() {
    super.connectedCallback();
    // elke seconde updaten → live klok
    this._timer = setInterval(() => (this._now = new Date()), 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._timer);
  }

  /* --------- hulpfuncties voor formattering --------- */
  _pad(n) { return String(n).padStart(2, "0"); }

  _formatTime(d) {
    return `${this._pad(d.getHours())}:${this._pad(d.getMinutes())}`;
  }

  _formatDate(d) {
    const day   = DUTCH_DAYS[d.getDay()];
    const month = DUTCH_MONTHS[d.getMonth()];
    const num   = d.getDate();
    return `${day} ${num} ${month}`;
  }

  render() {
    const time = this._formatTime(this._now);
    const date = this._formatDate(this._now);
    return html`
      <div class="time">${time}</div>
      <div class="date">${date}</div>
    `;
  }
}

/* ---------- Éénmalige registratie ---------- */
customElements.define("date-time-card", DateTimeCard);