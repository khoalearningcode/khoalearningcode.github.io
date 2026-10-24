# Cao Lê Minh Khoa — Portfolio

**Live site: https://khoalearningcode.github.io/**

Static portfolio for GitHub Pages. Edit `index.html`, case studies in `projects/`, and shared styles in `assets/site.css`. No build step or package installation is required.

Local preview: `python3 -m http.server 4173` from this directory.

Content is based on the supplied CV and project README files. MonoLaDN acceptance and author order are verified against https://accv2026.org/accepted-papers/. Research illustrations are conceptual, not experimental outputs. Private research repositories remain private.

## Site structure

- `index.html`: overview, career preview, and work filtered by activity type.
- `career.html`: professional timeline, education, and milestones.
- Work categories: Research / Industry / Self Project / Challenge.
- `projects/`: individual case studies, returning to their selected category.
- Filter selections are shareable through `?filter=research#work` and equivalent category links.
- Legacy `channels/` URLs redirect to the filtered work section.
- Shared navigation: About / Career / Work / Contact.

## Checks and maintenance

- `python3 scripts/check_site.py` validates local file references (including Open Graph images), alt text, per-page description and Open Graph/Twitter tags, canonical URLs and the sitemap. It runs on every push through `.github/workflows/check.yml`.
- `assets/site.css` is the only stylesheet. `assets/main.js` handles theme, filters, dialogs and the motion toggle; `assets/fx.js` handles reveal and card effects.
- Social preview image: `assets/og-image.svg` (source) and `assets/og-image.png` (1200×630, referenced by every page).
- Filters with no entries (currently Self Project) are hidden automatically.
- Replace the hero placeholder by adding `assets/portrait.jpg` (4:5) and changing the `<img src>` in `index.html`.
