Below are concise, repo-specific instructions to help an AI coding agent be productive working in this Jekyll site.

Key context (big picture)
- Static Jekyll site served on GitHub Pages. Source lives at the repo root; generated site is `_site/` (ignored).
- Layouts live in `_layouts/` (primary file: `_layouts/default.html`). Content is assembled from `index.html`, `projects.html`, `_includes/panels.html`, and `_data/*.yml`.
- Assets live under `assets/` (css, js, images, data). `assets/js/resume.js` lazily renders resume JSON into `#resume-root`.
- The site intentionally uses no GitHub Pages-only plugins (set `theme: null` in `_config.yml`) so modify core files directly.

Build & developer workflow
- Local build: `jekyll build` (or `bundle exec jekyll build` if using a Gemfile). Serve locally with `jekyll serve` to test dynamic behaviour (livereload used in local builds).
- Important: `_site/` is generated output; do not edit it. `.gitignore` already ignores `_site/` and a nested backup dir.

Project-specific conventions & patterns
- Panels and main content are modularized in `_includes/panels.html`. Edit that include to change tabbed panels (About/Resume/Projects/Contact/Content Lab).
- `index.html` now includes the panels via `{% include panels.html %}`. Keep front matter (title/description) in pages.
- `assets/js/resume.js` controls the accessible tab UI and lazy-loads `assets/data/resume.json`. When editing tabs, update both `_layouts/default.html` tab buttons and `resume.js` aria-controls matching IDs.
- Projects are data-driven: `_data/projects.yml` stores entries (title, description, lat/lng, image). `projects.html` renders cards and map markers from this file — update data, not templates, for content changes.
- CSS is single-file `assets/css/styles.css`; prefer small, targeted additions and keep the site minimal and performant. Use `--max-width` and layout variables at the top.

Integration points & external dependencies
- Leaflet is used via CDN in `projects.html` for interactive maps. Keep CDN references and integrity attributes simple; markers are injected from `_data/projects.yml`.
- Google Fonts are included in `_layouts/default.html`. For production, prefer a preload for critical fonts if optimizing.

Common tasks & where to make edits
- Add a project: edit `_data/projects.yml` (YAML list). Images should go in `assets/images/` and referenced by path.
- Change header/nav text or tabs: edit `_layouts/default.html` (tab buttons) and `_includes/panels.html` (panel bodies).
- Change resume content: edit `assets/data/resume.json` or modify `resume.js` renderer for formatting.
- Add scripts: place in `assets/js/` and include in the layout with `{{ '/assets/js/<file>' | relative_url }}` using `defer`.

Build/test edge cases & gotchas
- If the site fails locally with missing theme errors, ensure `_config.yml` has `theme: null` and, if necessary, create a minimal `Gemfile` with `github-pages` or `jekyll` to reproduce GitHub Pages environment.
- Avoid using unsupported plugins — GitHub Pages will not run arbitrary plugins. Keep transformations to JS or pre-build steps in CI if needed.
- When editing templates with Liquid inside `<script>` tags, be careful with Jekyll's templating (use `{% raw %}` when embedding template-like strings to avoid Liquid parsing).

AI agent guidance (do this first)
- Read `_layouts/default.html`, `_includes/panels.html`, `assets/js/resume.js`, and `_data/projects.yml` to understand data → view flow.
- Prefer data-driven changes: add or modify `_data/*.yml` and `_includes` partials rather than hardcoding in pages.
- Keep code minimal and mobile-first. Follow existing CSS variables and component patterns.

Examples (exact file references)
- To add a new project with map marker: add entry to `_data/projects.yml` with `title`, `description`, optional `lat`, `lng`, and `image`, then rebuild. `projects.html` already loops `site.data.projects.projects` to render cards and markers.
- To add a new panel: edit `_includes/panels.html` and ensure the header tab in `_layouts/default.html` has a matching `aria-controls` id.

When committing changes
- Stage source files only (do not commit `_site/`). Commit messages should be concise and reference the area changed, e.g. `Add hiking project data and map marker`.

If something is unclear
- Ask for the intended user-facing change (visual vs data change) and whether to update content (YAML/JSON) or templates/CSS. Provide a one-line design target (e.g. "make hero full-bleed with large Merriweather heading") before editing.