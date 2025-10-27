/**
 * logic.js
 * Pure logic utilities for the nonce project.
 * Contains no DOM manipulation; safe for reuse & testing.
 */

(function(global) {
  "use strict";

  /**
   * Decode a JWT payload (no signature verification).
   * @param {string} token - The JWT string.
   * @returns {object|null} Decoded payload object or null if invalid.
   */
  function decodeJwt(token) {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const json = atob(base64);
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  /**
   * Compute SHA-256 hash (hex) of input text.
   * @param {string} text
   * @returns {Promise<string>} Hex string.
   */
  async function sha256Hex(text) {
    const enc = new TextEncoder();
    const data = enc.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }

  /**
   * Shorten a token by hashing (SHA-256) and truncating.
   * @param {string} token
   * @param {number} length
   * @returns {Promise<string>} Truncated hash fingerprint.
   */
  async function shortenToken(token, length = 12) {
    const full = await sha256Hex(token);
    return full.slice(0, length);
  }

  // Expose in a single namespace
  global.NonceLogic = {
    decodeJwt,
    sha256Hex,
    shortenToken
  };
})(window);
