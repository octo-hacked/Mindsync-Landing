# MindSync landing page

A mobile-first React/Vite landing page for MindSync, an early-stage EEG-based decision-support research project. The site describes a 4-channel EEG proof of concept, signal-processing and CNN/RNN classifier work, and planned LLM summaries for therapist review. It does not claim that the prototype diagnoses conditions or that its outputs are validated.

## Project structure

- `src/App.jsx` — page sections, simulated workflow walkthrough, EEG pipeline, progress/team content, contact form, and UTM handling.
- `src/App.css` and `src/index.css` — component styling and responsive layouts; `public/design-tokens.css` is the single source for the pitch-deck palette and semantic colour aliases.
- `src/main.jsx` — React entry point.
- `public/` — static assets such as the favicon and any supplied media.
- `index.html` — page title, SEO, social-sharing metadata, and font preconnects.

## Run locally

```sh
npm install
npm run dev
```

`npm run build` creates the production site in `dist/`; `npm run lint` runs ESLint.

The pitch-deck palette is centralized in `public/design-tokens.css`. To verify text contrast for the token combinations used by the page, run `node scripts/check-contrast.mjs`.

## Connecting the contact form

The form reads `VITE_FORM_ENDPOINT` at build time. Create a local `.env.local` file in the project root and set it to an endpoint that accepts a JSON `POST` with `name`, `email`, `organisation`, `role`, `message`, `utm_source`, `utm_medium`, and `utm_campaign`. Restart the dev server after changing environment variables. Do not put private API secrets in `VITE_*` variables; they are included in browser code.

- **Formspree:** set the endpoint to your Formspree form URL and verify that the form accepts JSON submissions.
- **Google Apps Script:** deploy a web app that accepts the JSON payload and returns an appropriate response with the required CORS headers.
- **Your API:** implement the same JSON contract and allow requests from the deployed site origin.

When no endpoint is configured, the form opens a `mailto:` draft containing the form values and available UTM values. Set a monitored address in `CONTACT_DETAILS.email` in `src/App.jsx` before launch. The direct email action remains available as a `mailto:` draft; the WhatsApp action appears only after a real number is configured in `CONTACT_DETAILS.whatsapp`.

UTM source, medium, and campaign values are read from the URL, stored in the browser's session storage when available, and included in form submissions. The analytics hook is intentionally a no-op until a privacy-respecting, consent-aware implementation is chosen.

## TODO: launch assets and verified content

The supplied prototype renders are at `public/assets/prototype-headband.webp` and `public/assets/prototype-diagram.webp`. The headband render is omitted if it fails to load; the team uses initials when a headshot is unavailable.

| Exact path | What to provide | Recommended dimensions / format |
|---|---|---|
| `public/assets/team/hemendra.webp` | Approved headshot for Hemendra Harsh; initials display if absent | 800×600 WebP |
| `public/assets/team/piyush.webp` | Approved headshot for Piyush Bajpai; initials display if absent | 800×600 WebP |
| `public/assets/demo.mp4` | Optional reviewed workflow video; no patient-identifiable information | H.264 MP4, 1280×720, muted-friendly, compressed for mobile |
| `public/assets/demo-poster.webp` | Poster required when enabling the optional video | 1280×720 WebP |
| `public/assets/og.png` | Social-sharing preview image | 1200×630 PNG or JPEG |

The self-contained workflow walkthrough is the default and has no media dependency. To replace it with a video, set `CONFIG.demo.video` and provide `CONFIG.demo.poster` in `src/App.jsx`.

Also update the clearly marked TODOs before launch:

- `index.html`: replace `https://your-domain.example/` in the canonical, Open Graph, and Twitter image URLs with the verified production domain.
- `src/App.jsx`: configure `CONTACT_DETAILS.email` and, if desired, `CONTACT_DETAILS.whatsapp`.
- `src/App.jsx`: add only verified milestones, real mentor/advisor names and roles, an approved pilot/institution, and any clearly labelled preliminary results to `PROGRESS_ITEMS`.
- `src/App.jsx`: replace the headband design render with a real prototype photo when available; confirm the R&D prototype pipeline label.
- `src/App.jsx`: provide approved team headshots at the paths above; initials remain as the graceful fallback.
- `.env.local`: configure the production `VITE_FORM_ENDPOINT`, then test a real submission and the mailto fallback.

The site uses the existing Baloo Bhai 2 typeface and does not add third-party analytics or new dependencies.
