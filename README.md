# Muhammad Muzamil — Portfolio

A premium, dark-first personal portfolio built as a fast static site — no framework, no build step.

## Stack
- Semantic HTML5
- Custom CSS design system (`assets/css/style.css`) — tokens, fluid type, components
- Vanilla JavaScript (`assets/js/main.js`) — intro preloader, ⌘K / Ctrl+K command menu,
  scroll reveals, active-section nav, custom cursor, magnetic buttons, count-up stats,
  tech marquee, mobile menu, contact-form fallback
- Google Fonts: Space Grotesk / Inter / JetBrains Mono
- Respects `prefers-reduced-motion` throughout (preloader, marquee and motion all disabled)

## Keyboard
- **⌘K / Ctrl+K** (or `/`) — command menu: jump to any section, download résumé, copy email,
  open GitHub / LinkedIn

## Structure
```
index.html
assets/
  css/style.css
  js/main.js
  img/            profile + project screenshots
  docs/           résumé PDF
```

## Run locally
Open `index.html` in a browser, or serve the folder:
```
npx serve .
```

## Deploy
Works as-is on GitHub Pages / Netlify / Vercel (static). Set the repo's Pages source to the
root of this branch.

## Before publishing — remaining `TODO` markers in `index.html`
- **`assets/img/project-medium.jpg`** — replace the placeholder with a real Medium Clone screenshot (~1200×760)
- **`assets/img/project-store.jpg`** — replace the placeholder with a real E-commerce Store screenshot (~1240×600)
- `og:image` / canonical URL once deployed (add a 1200×630 `assets/img/og-cover.jpg`
  and swap `muhammadmuzamil.dev` for your real domain)
- Optional: wire the contact form to a real endpoint (e.g. Formspree) via
  `action="https://formspree.io/f/XXXX" method="POST"` — until then it opens the
  visitor's email client.

Content is current: 7th semester / 3.05 CGPA · Medium Clone (Laravel + Vue) as the featured
project + E-commerce Store · Dee Designers (Jul–Aug 2025) and Vista Solutions (Jul 2026 –
present) internships · real GitHub / LinkedIn URLs.
