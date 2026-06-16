# CLAUDE.MD

## Zweck

Dieses Repository ist eine statische persoenliche Website bzw. ein Blog fuer `moszeed.github.io`.
Die Anwendung rendert Inhalte clientseitig aus Markdown-Dateien und JSON-Metadaten.

## Projektkontext

Die Detailanalyse liegt in [docs/project-analysis.md](/C:/dev/moszeed.github.io/docs/project-analysis.md).
Der Modernisierungsplan liegt in [docs/modernization-plan.md](/C:/dev/moszeed.github.io/docs/modernization-plan.md).

## Aktueller Stack

- Frontend: `React`, `react-dom`, `react-markdown`, `remark-gfm`
- Build: `Vite`
- Content: `assets/blog/*.md`, `assets/posts.json`, `assets/pages.json`
- Lokale Auslieferung: `Dockerfile`, `docker-compose.yaml`, `nginx`
- Deployment: GitHub Pages per GitHub Actions

## Wichtige Arbeitsregeln

- Inhalte werden im Browser aus den Markdown- und JSON-Dateien geladen.
- `dist/` ist Build-Output und wird nicht versioniert.
- `master` ist aktuell der Default-Branch.
- Docker ist fuer Build und lokales Testen verpflichtend.
- Das Repository wurde von Vagrant-, Choo- und Browserify-Altlasten bereinigt.
- Nicht mehr benoetigte Asset-Sammlungen wurden entfernt; die Google-Verifizierungsdatei bleibt erhalten.

## Aktueller Fokus

1. Datenbasis und Content schlank halten.
2. Komponenten klein und wiederverwendbar halten.
3. Docker-Workflow stabil halten.
4. GitHub Pages Deploy auf `master` verlaesslich betreiben.

## Architekturprinzipien

- Programmcode bewusst einfach halten und unnoetige Abstraktionen vermeiden.
- Kleine, wiederverwendbare Komponenten bevorzugen.
- Gemeinsame UI-Bausteine zentralisieren, statt Markup zu duplizieren.
- Daten, Rendering und Layout trennen.
- Best Practices vor cleveren Sonderloesungen priorisieren.

## Vorsichtspunkte

- Es gibt Encoding-Artefakte in mehreren Content-Dateien.
- Projektseiten laden GitHub-READMEs derzeit noch zur Laufzeit.
- Das Layout soll sich optisch am bisherigen Auftritt orientieren und nicht unnoetig neu interpretiert werden.
