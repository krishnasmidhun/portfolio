# Midhun — Senior Web Engineer portfolio

A dependency-free static portfolio prepared for Cloudflare Pages.

## Deploy to Cloudflare Pages

This website has no build step.

### Direct upload

Upload the contents of this folder—or the supplied ZIP—to a Cloudflare Pages project using direct asset upload.

### Git deployment

- Build command: leave empty
- Build output directory: `/` or the repository root
- Root directory: repository root

## Preview locally

From this directory:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Files to edit

- `index.html`: visible page content and metadata
- `styles.css`: layout, typography and responsive styling
- `script.js`: navigation, reveal animation and email-form behaviour
- `content.md`: long-form editable source content
- `assets/*.svg`: original monochrome illustrations

## Before publishing

1. Add your LinkedIn URL if desired.
2. Decide whether Coinpedia may be named publicly. Replace it with “High-traffic publishing platform” if needed.
3. After attaching a custom domain, add an absolute canonical URL and `og:url` in `index.html`.
4. Replace `assets/social-card.svg` with a PNG export if a social platform does not preview SVG files.
5. Test the email links on the devices you normally use.
6. Add only verified metrics, testimonials and client logos you are permitted to publish.

## Contact form behaviour

The project-enquiry form does not send data to a server. It opens the visitor’s email application with the entered details addressed to `krishnasmidhun@gmail.com`.

This keeps the initial site simple and avoids collecting personal information. It can later be replaced with a Cloudflare Pages Function, Turnstile and an email provider.
