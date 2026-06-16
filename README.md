# moszeed.github.io

Persoenliche statische Website mit Markdown-Content, React im Frontend und Docker als verbindlichem lokalen Build- und Vorschau-Workflow.

## Lokaler Start

Die Seite wird innerhalb von Docker gebaut und lokal ueber Nginx ausgeliefert.

```bash
docker compose -f docker-compose.yaml up --build
```

Danach ist die Website unter [http://localhost:8080](http://localhost:8080) erreichbar.

## Deploy

Deployments auf GitHub Pages laufen ueber GitHub Actions nach Push auf `master`.
Der Build erzeugt statische Dateien in `dist/` und veroeffentlicht diese ueber den offiziellen Pages-Workflow.

## Content pflegen

- Blogposts liegen in `assets/blog/*.md`
- Post-Metadaten liegen in `assets/posts.json`
- Projekt- und Linkdaten liegen in `assets/pages.json`

## Architektur

- React mit kleinen, wiederverwendbaren Komponenten
- Vite fuer den statischen Build
- Docker als Standard fuer Build und lokale Vorschau
- GitHub Pages als Ziel fuer das Live-Deployment
