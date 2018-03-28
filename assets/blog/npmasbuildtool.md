# NPM Scripts
Will man heutzutage ein Projekt für den Browser realisieren   
gehören Dinge wie das minifizieren und optimieren   
der einzelnen Javascript-, CSS- und HTML-Dateien bereits zum guten Ton.  

Kommen dann noch Code-Linter, Unit-Tests und Programme wie Browserify hinzu,   
ist es bald sehr nervig alle diese Schritte und zugehörigen Tools immer wieder
manuell auszuführen.

Folgt man daraufhin der Entwickler Einstellung:


    Faulheit ist dein bester Freund. 
    Mach niemals Dinge zweimal, 
    wenn du Sie beim ersten mal automatisieren kannst

stößt man bei Suche nach Automatisierung schnell auf Tools wie **Grunt** oder **Gulp**.

Beides sind Möglichkeiten wiederkehrende Prozesse zu automatisieren,  
allerdings mit ein paar Haken:

**sie sind zu aufgebläht:**
Möchte man beispielsweise nur Javascript Dateien minimieren, 
so benötigt man mit Grunt folgendes:

- die **grunt-cli** zur Steuerung
- eine **Installation der Grunt Runtime** innerhalb des Projekts
- das **Plugin zur Minimierung** der Javascript Dateien und
- eine **Gruntfile** für die Konfiguration des ganzen Ablaufs

Ähnlich muss man auch mit Gulp verfahren. 

**sie sind abhängig von Plugin`s:**
Grundsätzlich sind Plugin`s was tolles, vor allem wenn sie:

- funktionieren
- einfach zu benutzen sind und
- gepflegt werden

 beschränkt man sich auf die offiziellen Plugin`s, so wird man   
 alle 3 Punkte erfüllt finden, allerdings wird man schnell mehr wollen  
 und bei Drittanbieter Plugin`s bei denen entweder keiner, ein paar, in beschränktem  
 Rahmen oder nur Zeitweise alle Punkte zutreffen.

 Jeder Wordpress Nutzer wird wissen wie nah Spaß und Frust bei der
 Nutzung von Plugin`s zusammen liegen. 

**und sie sind zusätzliche Fehlerquellen**
Zusätzliche Programme oder Abstraktionsebenen schaffen immer auch Raum für Fehler,  
die selber verursacht, bspw. durch falsche Benutzung, fehlerhafte Programme  
oder genutzten Plugin`s entstehen können.

nun wie anders machen !? 


## **NPM als TaskRunner**

Um nun so viel unnötigen Ballast wie möglich los zu werden, 
warum nicht das CLI-Tool benutzen das bei jeder Node.js Installation mitgeliefert wird ?!  **NPM** !

Die Nutzung erfolgt über die CLI Eingabe von Programmen wie zum Beispiel 
 "UglifyJS" ( https://github.com/mishoo/UglifyJS2 ), 
 "CleanCSS" ( https://github.com/jakubpawlowicz/clean-css ) und 
 "Browserify" (https://github.com/substack/node-browserify) 
in Verbindung mit der in der "package.json" vorhandenen Möglichkeit "scripts" Bereiche zu definieren.

Ein paar Beispiele:

## **Javascript Code mit UglifyJS optimieren**
    {
      "name": "npm-scripts-demo",
      "version": "0.1.0",
      “description": "a Demo for NPM Scripts",
      "scripts": {
        "build:js": "uglifyjs ./src/js/main.js -c -v -o ./dist/js/main.min.js"
      }
    }

Ausgeführt wird das ganze nun über die Kommandozeile:

    $ npm run build:js


## **CSS verkleinern**
    {
      "name": "npm-scripts-demo",
      "version": "0.1.0",
      “description": "a Demo for NPM Scripts",
      "scripts": {
        "build:css": "cleancss -o ./dist/css/main.min.css ./src/css/main.css"
      }
    }
    

Und um die Ausführung zu starten:

    $ npm run build:css 


****
## **Veränderungen überwachen**

Da man ja nicht andauernd selber die einzelnen Scripte starten möchte,
definieren wir einen sogenannten "watch" Task.
Hierzu bietet sich das Programm "**nodemon**" ( https://github.com/remy/nodemon ) an,  
es läuft ebenfalls über die Kommandozeile, überwacht Dateien und bietet die Möglichkeit Aktionen bei Änderungen zu definieren.

Am Beispiel sieht das ganze folgendermaßen aus:

    {
      "name": "npm-scripts-demo",
      "version": "0.1.0",
      “description": "a Demo for NPM Scripts",
      "scripts": {
      
        "watch": "npm run watch:js & npm run watch:css",
          "watch:js" : "nodemon -e js -w ./src/js/ -x 'npm run build:js'",
          "watch:css": "nodemon -e less -w ./src/css/ -x 'npm run build:css",
          
        "build:js" : "uglifyjs ./src/js/main.js -c -v -o ./dist/js/main.min.js",
        "build:css": "cleancss -o ./dist/css/main.min.css ./src/css/main.css"
      }
    }
    

Und um die Ausführung der Dateiüberwachung  zu starten:

    $ npm run watch

Ein etwas komplexeres Beispiel hat Richard auf seinem Github Account zur Verfügung gestellt
https://github.com/richardkarsten/npm_workflow/blob/master/package.json

Anmerkungen? Fragen? Wünsche ? Der Kommentarbereich ist das was du suchst !

