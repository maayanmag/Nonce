/**
 * ui.js
 * DOM & interaction layer for the nonce project.
 * Relies on pure helpers in logic.js (NonceLogic namespace).
 */

(function(global, doc) {
  "use strict";

  // State
  let currentToken = null;
  let shortened = "";
  let expanded = false;

  // Elements
  const els = {};

  function cacheElements() {
    els.output = doc.getElementById("output");
    els.shortenedOutput = doc.getElementById("shortened-output");
    els.actions = doc.getElementById("actions");
    els.signInButton = doc.getElementById("signin-button");
    els.description = doc.getElementById("description");
    els.showMoreBtn = doc.getElementById("showMoreBtn");
    els.decodeBtn = doc.getElementById("decodeBtn");
    els.shortenBtn = doc.getElementById("shortenBtn");
  }

  function initEvents() {
    if (els.showMoreBtn) {
      els.showMoreBtn.addEventListener("click", toggleShowMore);
    }
    if (els.decodeBtn) {
      els.decodeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        visualizeToken();
      });
    }
    if (els.shortenBtn) {
      els.shortenBtn.addEventListener("click", (e) => {
        e.preventDefault();
        shortenMyToken();
      });
    }
    els.shortenedOutput.addEventListener("click", (e) => {
      if (e.target && e.target.matches("[data-copy-short]")) {
        copyShortenedToken();
      }
    });
  }

  // Google Sign-In callback (must be global)
  async function handleCredentialResponse(response) {
    const token = response.credential;
    currentToken = token;

    els.output.textContent = token;
    show(els.output);
    show(els.actions);
    hide(els.signInButton);
    hide(els.description);
    showInline(els.showMoreBtn);
  }

  function toggleShowMore() {
    expanded = !expanded;
    els.output.classList.toggle("expanded");
    els.showMoreBtn.textContent = expanded ? "Show less" : "Show more";
  }

  function visualizeToken() {
    if (!currentToken) return;
    const decoded = global.NonceLogic.decodeJwt(currentToken);
    if (!decoded) {
      alert("Invalid token structure.");
      return;
    }
    alert("Decoded Token:\\n\\n" + JSON.stringify(decoded, null, 2));
  }

  async function shortenMyToken() {
    if (!currentToken) return;
    shortened = await global.NonceLogic.shortenToken(currentToken, 12);
    els.shortenedOutput.innerHTML =
      '<code>' + shortened + '</code>' +
      '<button class="copy-inline" data-copy-short>Copy</button>';
    show(els.shortenedOutput);
  }

  function copyShortenedToken() {
    if (!shortened) return;
    navigator.clipboard.writeText(shortened).then(() => {
      alert("Shortened token copied to clipboard!");
    });
  }

  // Small helpers
  function show(el) { if (el) el.style.display = "block"; }
  function showInline(el) { if (el) el.style.display = "inline-block"; }
  function hide(el) { if (el) el.style.display = "none"; }

  // Initialize after DOM ready
  function onReady(fn) {
    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  onReady(() => {
    cacheElements();
    initEvents();
  });

  // Expose callback globally for Google script
  global.handleCredentialResponse = handleCredentialResponse;
})(window, document);
