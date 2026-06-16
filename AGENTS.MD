# AGENTS.MD

## Mission

Arbeite in diesem Repository wie an einer kleinen statischen Publishing-Plattform mit schlankem React-Frontend.
Ziel ist Weiterentwicklung ohne Verlust des bestehenden Markdown-Content-Workflows und ohne unnoetige Komplexitaet.

## Primaere Referenzen

- Analyse: [docs/project-analysis.md](/C:/dev/moszeed.github.io/docs/project-analysis.md)
- Migrationsplan: [docs/modernization-plan.md](/C:/dev/moszeed.github.io/docs/modernization-plan.md)

## Repository-Wissen

- Einstiegspunkt ist [src/main.jsx](/C:/dev/moszeed.github.io/src/main.jsx) und [src/App.jsx](/C:/dev/moszeed.github.io/src/App.jsx).
- Inhalte liegen in [assets/blog](/C:/dev/moszeed.github.io/assets/blog), [assets/posts.json](/C:/dev/moszeed.github.io/assets/posts.json) und [assets/pages.json](/C:/dev/moszeed.github.io/assets/pages.json).
- Build-Output entsteht unter `dist/` und wird nicht eingecheckt.
- Die lokale Umgebung läuft verbindlich ueber Docker.
- Der visuelle Stil soll nahe am bisherigen Auftritt bleiben.

## Erwartete Vorgehensweise fuer Agenten

1. Vor Codeaenderungen pruefen, ob nur Content, Build oder Architektur betroffen ist.
2. Markdown-basierte Inhaltspflege immer erhalten oder sauber migrieren.
3. Neue Tooling-Entscheidungen klein und nachvollziehbar halten.
4. Fuer Deployments GitHub Pages mit GitHub Actions bevorzugen, nicht branch-pushende Fremdtools.
5. Fuer lokale Entwicklung und Build-Pfade Docker als Pflichtpfad behandeln.
6. Unbenutzte Dateien und Assets aktiv entfernen, wenn sie keine Funktion mehr haben.

## Architekturziele

- React in einer schlanken Form statt schwerem Framework-Overhead
- Wenige Abhaengigkeiten
- Moeglichst statischer Build fuer GitHub Pages
- Einfache Content-Pipeline aus Markdown-Dateien
- Kompakter, idempotenter Docker-Workflow fuer Build und lokales Testen

## Umsetzungsstil

- Code so einfach wie moeglich halten.
- Wiederverwendbare Komponenten vor Copy-and-paste bevorzugen.
- Abstraktionen nur einfuehren, wenn sie echten Duplikatabbau oder Klarheit bringen.
- Kleine Module mit klarer Verantwortung bevorzugen.
- Lesbarkeit und Wartbarkeit hoeher gewichten als technische Spielereien.

## Offene technische Punkte

- Die App laedt externe GitHub-READMEs zur Laufzeit statt Inhalte vorab zu erzeugen.
- Einige Content-Dateien enthalten noch Encoding-Artefakte.
- Rechtstexte sind aktuell knapp gehalten und koennen spaeter noch in echte Content-Dateien ausgelagert werden.

## Definition von Erfolg

- Markdown-Content bleibt editierbar.
- Lokales Starten funktioniert mit einem klaren Docker-Befehl.
- Build-Artefakte fuer GitHub Pages entstehen reproduzierbar.
- Deployment wird automatisch nach Push auf `master` ausgeloest.
- Das Frontend bleibt bewusst klein und wartbar.
