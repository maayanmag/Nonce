# nonce

Disposable, short-lived identity viewer using Google ID Tokens.  
Sign in once, inspect the raw JWT, decode its payload, and generate a stable shortened fingerprint (truncated SHA-256 hash).

## Features
- Google Identity Services integration (no backend required)
- Displays the issued ID Token (JWT) safely in the browser
- One-click payload decode (header/payload only; no signature verification)
- Shortened deterministic fingerprint via SHA-256 (first 12 hex chars)
- Separation of concerns: HTML (structure), CSS (presentation), logic (pure), UI (DOM orchestration)

## File Structure
```
index.html     # Markup & script/style loading
styles.css     # Visual design and layout
logic.js       # Pure functions: JWT decode & hashing utilities (NonceLogic namespace)
ui.js          # DOM wiring, event handling, state transitions
A_2D_digital_graphic_of_a_JWT_(JSON_Web_Token)_ico.png  # Favicon
README.md      # Documentation
```

## Runtime Flow
1. User clicks Google Sign-In button (rendered by Google script).
2. Google returns a credential (ID Token) to global `handleCredentialResponse`.
3. `ui.js` stores token, reveals UI sections, enables actions.
4. User may:
   - View full token (with Show more/less expansion).
   - Decode payload (base64url → JSON parse).
   - Generate shortened fingerprint (SHA-256 → truncate to 12 chars).
5. Copy shortened value to clipboard.

## Core Logic (logic.js)
- `decodeJwt(token)` – Parses JWT payload only (no signature validation).
- `sha256Hex(text)` – Returns full SHA-256 hex digest.
- `shortenToken(token, length=12)` – Produces truncated fingerprint.

## UI Layer (ui.js)
- Caches elements, binds events.
- Exposes `handleCredentialResponse` globally (required by Google script).
- Handles state transitions (hide description/sign-in; show token/actions).
- Delegates cryptographic + decode operations to `NonceLogic`.

## Security / Trust Notes
- This demo does not validate JWT signatures (no public keys fetched).
- Do not use this as an auth system—purely educational/visual.
- Token content stays in the browser; no network transmission beyond Google.
- Shortened hash is NOT reversible, but still derived from full token—treat output as sensitive.

## Local Usage
Just open `index.html` in a modern browser:
```
open index.html   # macOS
```
Requires network access for Google Identity Services script.

## Customization Ideas
- Add signature verification (JWKS fetch + crypto verification).
- Show token header separately.
- Add expiration countdown.
- Export decoded payload as JSON.
- Dark/light mode toggle.

## Accessibility Considerations
- Buttons use visible text labels.
- Tooltips appear on hover/focus (keyboard accessible via focus-within).
- High-contrast glass effect kept readable with adequate text color.

## Browser Requirements
- Modern browser with `crypto.subtle` and `TextEncoder` (Edge 79+, Chrome 37+, Firefox 34+, Safari 11+).

## Disclaimer
Educational example only. Not production-grade identity or security tooling.
