# Modernisierungsplan: `moszeed.github.io`

## Zielbild

Die Website bleibt ein schlankes statisches Projekt, Inhalte werden weiter als Markdown gepflegt, Builds laufen reproduzierbar innerhalb von Docker, lokales Testen erfolgt ebenfalls über Docker, und Deployments auf GitHub Pages erfolgen automatisch nach Push auf `master`.

## Leitplanken für die Umsetzung

- Der Programmcode soll bewusst klein und verständlich bleiben.
- Komponenten sollen wiederverwendet werden, wenn dadurch Markup oder Logik mehrfach genutzt wird.
- Modularität ist erwünscht, aber nur in einfacher Form.
- Best Practices sind wichtiger als maximale Abstraktion.
- Neue Architektur soll für Einzelpersonen leicht wartbar bleiben.

## 1. Vagrant entfernen

### Ziel

Den doppelten Virtualisierungs-Stack abschaffen und Docker als einzigen lokalen Build- und Testworkflow behalten.

### Maßnahmen

1. `Vagrantfile` aus dem aktiven Workflow entfernen.
2. README und Root-Dokumentation ausschließlich auf Docker ausrichten.
3. `docker-compose.yaml` auf modernes Compose-Format mit `services:` umstellen.
4. `Dockerfile` auf aktuelles, schlankes Node-Image migrieren.
5. Container-Start so gestalten, dass Build und lokales Testen reproduzierbar und ohne manuelle Vorarbeit laufen.

### Empfehlung

Docker bleibt nicht optional.
Empfohlen ist ein kompakter Standardfluss wie `docker compose up --build`, der die Anwendung im Container baut und lokal unter einem festen Port ausliefert.

### Zielbild für Idempotenz

- wiederholtes `docker compose up --build` liefert denselben lauffähigen Zustand
- keine manuellen Host-Schritte außer Docker/Compose
- Abhängigkeiten werden im Image oder über klar definierte Volumes kontrolliert
- keine versteckten Seiteneffekte aus Vagrant oder lokalen Node-Installationen

## 2. Choo durch schlankes React ersetzen

### Ziel

Die bestehende Funktionalität mit geringem Overhead auf eine aktuelle, wartbare React-Basis bringen.

### Empfohlene Bauweise

- React + React DOM
- Vite als Build-Tool
- React Router nur falls wirklich nötig, alternativ weiterhin kleines Hash-Routing
- CSS als einfache Dateien oder CSS Modules
- `markdown-it` oder `react-markdown` für Markdown-Ausgabe
- kleine, wiederverwendbare Komponenten für Layout, Navigation, Listen und Markdown-Seiten

### Warum diese Richtung

- deutlich kleinerer und modernerer Tooling-Stack als Browserify + Watchify + Sheetify
- sehr einfache lokale Entwicklung
- gute GitHub Pages-Kompatibilität
- React ist langfristig leichter wartbar und leichter durch weitere Tools erweiterbar
- Vite lässt sich sehr gut in einen Docker-basierten Dev- und Build-Workflow integrieren

### Grobe Migrationsschritte

1. Neue App-Struktur unter `src/` anlegen.
2. Routing, Navigation, Post-Liste und Detailseiten in kleine Komponenten trennen.
3. JSON- und Markdown-Daten zunächst unverändert weiterverwenden.
4. Inline-Styling aus `client/app.js` in normale Styles auslagern.
5. Rechtstexte aus dem JavaScript in Markdown oder dedizierte Content-Dateien verlagern.
6. Externe GitHub-READMEs möglichst im Build vorverarbeiten oder durch lokale Projektbeschreibungen ersetzen.
7. Container so konfigurieren, dass Hot Reload oder ein stabiler lokaler Preview-Modus im Docker-Workflow funktioniert.

## 3. Bibliotheken aktualisieren

### Ziel

Reproduzierbare, wartbare und sichere Abhängigkeiten.

### Maßnahmen

1. `package.json` neu strukturieren.
2. `latest`-Versionen durch konkrete Versionen ersetzen.
3. Lockfile einführen.
4. Nicht mehr benötigte Pakete entfernen:
   - `choo`
   - `choo-devtools`
   - `sheetify`
   - `browserify`
   - `watchify`
   - `yo-yoify`
   - `babelify`
   - `uglify-js`
   - große Teile der alten Babel-Konfiguration
5. ESLint auf ein modernes, kleines Setup heben.
6. Optional Prettier ergänzen.

### Zusätzliche Bereinigung

- Altes Google+-Skript aus `index.html` entfernen
- Encoding-Probleme beheben
- prüfen, ob alle Icon-Assets noch benötigt werden
- Dockerfile und Compose-Datei auf kleine, verständliche und wiederholbar ausführbare Kommandos reduzieren

## 4. Automatische Deploys mit GitHub Pages

### Wunschbild

Markdown bleibt die Quelle.
Ein Push auf `master` baut die Seite und veröffentlicht nur dann die erzeugten statischen Dateien auf die bestehende GitHub Pages Site.

### Empfehlung

Nicht mehr auf einen manuell gepflegten `gh-pages`-Branch setzen, sondern GitHub Pages direkt über GitHub Actions deployen.
Das passt besser zu einem Build-Prozess und vermeidet committete Build-Artefakte.

### Begründung aus aktueller GitHub-Doku

- GitHub empfiehlt für einfache Fälle Branch-Publishing, für eigene Build-Prozesse jedoch explizit GitHub Actions.
- Bei Pages mit Custom Workflow besteht der Standardfluss aus Checkout, Build, `upload-pages-artifact` und `deploy-pages`.
- Branch-basierte Builds werden nicht durch Commits ausgelöst, die aus einem Workflow mit `GITHUB_TOKEN` in den Publishing-Branch geschrieben werden.

### Konkrete Zielarchitektur

1. In den Repository-Settings unter Pages die Source auf `GitHub Actions` stellen.
2. Workflow unter `.github/workflows/deploy-pages.yml` anlegen.
3. Trigger:
   - `push` auf `master`
   - optional `workflow_dispatch`
4. Build:
   - Node einrichten
   - Dependencies installieren
   - statischen Output erzeugen, z. B. in `dist/`
5. Deploy:
   - `actions/configure-pages`
   - `actions/upload-pages-artifact`
   - `actions/deploy-pages`

### Warum das besser ist als `gh-pages`-Branch-Pushes

- sauberer, offizieller GitHub-Pages-Weg
- kein Bot-Commit in einen Build-Branch nötig
- klarere Historie im Hauptbranch
- einfacher Schutz über das `github-pages`-Environment

### Wichtig für dieses Projekt

- Falls reine statische Dateien deployt werden, sollte ein `.nojekyll` im Ausgabeordner erzeugt werden, damit GitHub Pages keine unerwartete Jekyll-Interpretation vornimmt
- Wenn ein Custom Domain Setup existiert, muss `CNAME` im Build-Output erhalten bleiben
- `master` ist aktuell der Default-Branch, der Workflow sollte also genau auf `master` triggern, nicht pauschal auf `main`
- Der CI-Build sollte denselben Build-Befehl verwenden wie der Docker-Workflow lokal oder bewusst eng daran angelehnt sein

## 5. Empfohlene Umsetzungsreihenfolge

1. Docker-Zielworkflow definieren und bestehendes Container-Setup modernisieren.
2. Vagrant entfernen und Dokumentation vollständig auf Docker ausrichten.
3. Neues Frontend mit Vite + React als parallelen Pfad aufsetzen.
4. Content-Layer übernehmen.
5. Build-Output im Container lokal verifizieren.
6. GitHub Actions Deploy einführen.
7. Danach `dist/`-Strategie und Legacy-Code (`client/`, `bin/watch-js.sh`, `Vagrantfile`) entfernen.

## 6. Ergebnis nach der Modernisierung

- Markdown bleibt Autorenformat
- React ersetzt Choo ohne unnötige Komplexität
- keine Vagrant-Abhängigkeit mehr
- Docker ist der eindeutige Standard für lokalen Build und Vorschau
- saubere, reproduzierbare Builds
- automatischer GitHub-Pages-Deploy nach Push auf `master`

## Quellen für den Deploy-Teil

- [GitHub Docs: Configuring a publishing source for your GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub Docs: Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
