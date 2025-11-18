// ------------------------------------------------------------
// Date‑Time Card – Home Assistant Custom Lovelace Card
// Author: Nathan van Dael
// ------------------------------------------------------------

import { LitElement, html } from "https://cdn.jsdelivr.net/npm/lit@2.8.0/+esm";

class DateTimeCard extends LitElement {
    static properties = {
        _now: { state: true },   // actual date/time
        _config: { state: false },  // configuration‑object (title, etc.)
        _locale: { state: false },  // locale‑object of HA (cached)
    };

    constructor() {
        super();
        this._now = new Date();
        this._config = {};
        this._locale = null;
    }

    /* ---------- Lifecycle ---------- */
    connectedCallback() {
        super.connectedCallback();

        // Update every 100 ms → smooth seconds‑display
        this._timer = setInterval(() => {
            this._now = new Date();
        }, 100);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        clearInterval(this._timer);
    }

    /* ---------- setConfig (mandatory) ---------- */
    setConfig(config) {
        if (typeof config !== "object") {
            throw new Error("Invalid configuration for date-time-card");
        }
        this._config = config;
    }

    /* ---------- Keep HA‑locale up‑to‑date ------ */
    updated(changedProps) {
        if (changedProps.has("hass")) {
            if (this.hass && this.hass.locale) {
                this._locale = this.hass.locale;
            }
        }
    }

    /* ---------- Formatteringshelpers ---------- */

    /** Format date **met full date** (weekday + day + month + year) */
    _formatDate(date) {
        // Fallback‑language if HA has nothing loaded
        const language = (this.hass && this.hass.language) ? this.hass.language : "en";

        const opts = {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        };

        return new Intl.DateTimeFormat(language, opts).format(date);
    }

    /** Format time respecting HA locale + language */
    _formatTime(date) {
        // Fallback‑language if HA has nothing loaded
        const language = (this.hass && this.hass.language) ? this.hass.language : "en";

        const hour12 = this._locale?.time_format === "12";

        const opts = {
            hour: "numeric",
            minute: "numeric",
            hour12,
        };
        return new Intl.DateTimeFormat(language, opts).format(date);
    }

    render() {
        const time = this._formatTime(this._now);
        const date = this._formatDate(this._now);
        const title = this._config.title ?? "";

        return html`
      <ha-card header="${title}">
        <div style="padding: 1rem;">
          <div style="font-size: 2.2rem; font-weight: 600;">${time}</div>
          <div style="margin-top: 0.4rem; font-size: 1.2rem; opacity: 0.85;">
          <div style="font-size: 1.5rem; font-weight: 600; color:gray;">${date}</div>
          </div>
        </div>
      </ha-card>
    `;
    }
}

/* ------------------- Registration (one-time) ------------------- */
customElements.define("date-time-card", DateTimeCard);