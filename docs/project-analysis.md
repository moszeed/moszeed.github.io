# Projektanalyse: `moszeed.github.io`

## Kurzfazit

Das Projekt ist eine kleine, clientseitig gerenderte persönliche Website mit Blog-Charakter.
Die Inhalte werden aus Markdown-Dateien und JSON-Konfigurationen geladen.
Das technische Fundament ist funktional, aber stark historisch geprägt.

## Ist-Zustand

### Struktur

- Einstiegspunkt: [index.html](/C:/dev/moszeed.github.io/index.html)
- App-Code: [client/app.js](/C:/dev/moszeed.github.io/client/app.js)
- Gebaute Assets: [dist/js/app.js](/C:/dev/moszeed.github.io/dist/js/app.js), [dist/js/app.min.js](/C:/dev/moszeed.github.io/dist/js/app.min.js)
- Content:
  - [assets/posts.json](/C:/dev/moszeed.github.io/assets/posts.json)
  - [assets/pages.json](/C:/dev/moszeed.github.io/assets/pages.json)
  - [assets/blog](/C:/dev/moszeed.github.io/assets/blog)
- Lokale Umgebungen:
  - [Dockerfile](/C:/dev/moszeed.github.io/Dockerfile)
  - [docker-compose.yaml](/C:/dev/moszeed.github.io/docker-compose.yaml)
  - [Vagrantfile](/C:/dev/moszeed.github.io/Vagrantfile)

### Frontend-Architektur

- Single-file-App in `client/app.js`
- Routing mit Hash-Routes
- Rendering mit `choo/html`
- Styling per `sheetify` direkt im JavaScript
- Markdown-Rendering im Browser via `markdown-it`
- Remote-READMEs von GitHub werden zur Laufzeit per `fetch()` geladen

### Content-Modell

- Blogposts liegen als Markdown-Dateien unter `assets/blog/*.md`
- Blog-Listen und Metadaten werden in `assets/posts.json` gepflegt
- Projekt- und Linklisten werden in `assets/pages.json` gepflegt
- Die Inhalte selbst sind also bereits dateibasiert und gut für statische Generierung geeignet

## Auffälligkeiten und Risiken

### Tooling

- [package.json](/C:/dev/moszeed.github.io/package.json) nutzt fast durchgehend `latest`
- Es gibt kein Lockfile
- Das macht Builds nicht reproduzierbar

### Build-Workflow

- [bin/watch-js.sh](/C:/dev/moszeed.github.io/bin/watch-js.sh) ist Unix-lastig
- Das Projekt ist lokal unter Windows unnötig sperrig
- `dist/` wird committet, weil kein sauberer CI-Build-Deploy-Flow existiert

### Container- und Legacy-Infrastruktur

- Docker ist bereits vorhanden und damit eine gute Basis für den Zielworkflow
- Vagrant installiert innerhalb einer VM wiederum Docker Compose
- Der Workflow ist heute unnötig komplex
- Das `docker-compose.yaml` nutzt die alte Schreibweise ohne `services`
- Das Docker-Image basiert auf `mhart/alpine-node`, was heute nicht mehr die beste Basis ist
- Das bestehende Container-Setup ist noch nicht klar als kompakter, idempotenter Standard-Workflow ausformuliert

### Code-Struktur

- Sehr große Datei `client/app.js`
- Rechtstexte, Layout, Routing und Datenzugriff sind vermischt
- Erschwert Tests, Migrationen und inkrementelle Änderungen

### Browser-/Content-Risiken

- `index.html` lädt noch ein Google+-Skript, obwohl Google+ eingestellt wurde
- Mehrere Texte zeigen Encoding-Artefakte
- Externe GitHub-README-Requests machen die Seite von Fremd-APIs abhängig

## Positiv am Bestand

- Die Website ist klein und fachlich überschaubar
- Markdown ist schon etabliert
- Keine komplexe Backend-Abhängigkeit
- Ein Umstieg auf statische Generierung ist relativ gut machbar
- GitHub Pages passt grundsätzlich sehr gut zum Projekt
- Docker kann hier sinnvoll als verbindliche Build- und Testhülle dienen

## Technische Schlussfolgerung

Die beste Modernisierung ist keine 1:1-Portierung der aktuellen Browserify/Choo-App, sondern ein kleiner Neuaufbau:

- React in schlanker Form
- statischer Build
- Markdown als Quelle behalten
- GitHub Pages Deployment per GitHub Actions
- Docker als verpflichtende, reproduzierbare Hülle für Build und lokales Testen
