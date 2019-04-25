(() => {
    'use strict';

    const html = require('choo/html');
    const css = require('sheetify');
    const choo = require('choo');
    const markdown = require('markdown-it')();

    const collator = new Intl.Collator(undefined, {
        numeric    : true,
        sensitivity: 'base'
    });

    const body = css`
        @import url('https://fonts.googleapis.com/css?family=Roboto');

        :host {
            display: grid;
            grid-template-columns: 300px auto;
            grid-template-rows: auto;
        }

        html, body {
            padding: 0;
            margin: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            font-size: 1em;
            font-family: 'Roboto', sans-serif;
        }

        h1 {
            background-color: #1E1E1ECC;
            border-bottom: 1px solid;
            padding: 16px;
            margin: 0;
            letter-spacing: 1px;
            color: #FEFEFE;
        }

        h2 {
            background-color: #eeeeee;
            padding: 8px;
            margin-top: 30px;
            font-size: 120%;
        }

        nav {
            color: #EFEFEF;
            background-color: #121212;
            padding: 10px;
            font-size: 90%;
        }

        nav.menu ul {
            list-style: none;
            padding: 0;
        }

        nav p {
            letter-spacing: 1px;
            font-size: 80%;
            padding: 20px;
            background-color: #868585E6;
            border-radius: 100%;
            height: 50px;
            width: 50px;
            position: relative;
        }

        nav p span {
            position:absolute;
            left: 20px;
            top: 20px;
            width: 240px;
        }

        nav h4 {
            margin-bottom: 4px;
        }

        nav section {
            padding: 40px 20px;
        }

        nav ul.project {
            margin-left: 10px;
        }

        nav hr {
            border: 1px solid #363636;
        }

        nav ul li {
            color: #EFEFEF;
            text-transform: lowercase;
            margin-bottom: 8px;
            margin-top: 8px;
        }

        main section ul li {
            display: grid;
            grid-template-columns: 170px auto;
            margin-bottom: 8px;
        }

        main section ul li:hover {
            cursor: pointer;
            background-color: #D4D4D4;
        }

        nav ul li.firstItem {
            margin-bottom: 8px;
        }

        nav ul li:hover {
            cursor: pointer;
            text-decoration: underline;
        }

        #impressum {
            position: absolute;
            left: 20px;
            bottom: 10px;
            border-top: 1px solid #393939;
        }

        #impressum a {
            color: #626262;
            font-size: 12px;
            text-decoration: none;
            margin-right:10px;
        }

        pre {
            font-family: "Courier 10 Pitch", Courier, monospace;
            font-size: 95%;
            line-height: 140%;
            white-space: pre;
            white-space: pre-wrap;
            white-space: -moz-pre-wrap;
            white-space: -o-pre-wrap;
            background: #262626;
            color: #E1E2A4;
            padding: 16px;
            max-height: 300px;
            overflow: auto;
        }

        code {
            font-family: Monaco, Consolas, "Andale Mono", "DejaVu Sans Mono", monospace;
            font-size: 95%;
            line-height: 140%;
            white-space: pre;
            white-space: pre-wrap;
            white-space: -moz-pre-wrap;
            white-space: -o-pre-wrap;
        }

        main {
            background-color: #FEFEFE;
            padding: 20px;
            overflow: auto;
            box-shadow: 4px 0px 6px inset #333333;
            display: grid;
            grid-template-columns: auto;
            grid-template-rows: auto;
            font-size: 90%;
        }

        main section {
            overflow: auto;
            padding: 10px;
        }

        main.blog {
            display: block;
            padding: 5% 10%;
        }

        main.blog ul li {
            padding: 2px 10px 2px 10px;
        }

        main.blog section.external {
            padding: 20px;
        }

        @media (max-width: 1100px) {
            main {
                display: block;
            }
        }

        @media (max-width: 900px) {
            :host {
                display: block;
                overflow: auto;
            }

            nav ul li{
                display: inline-flex;
                margin-right: 16px;
            }
        }

        iframe {
            margin-top: -65px;
            height: calc(100% + 65px);
        }

        main.externalLink iframe {
            margin: 0;
            height: 100%;
            width: 100%;
            border: 0;
        }

        #posts .post {
            display: flex;
            margin-bottom: 8px;
            border-bottom: 1px solid #dedede;
        }

        #posts .post:hover {
            background-color: #dedede;
            cursor: pointer;
        }

        #posts .post div {
            flex-grow: 1;
            flex-shrink: 1;
            text-align: left;
            vertical-align: bottom;
        }

        #posts .post div.created {
            background-color: #ededed;
            padding: 8px 4px 0 8px;
            flex-basis: 135px;
            flex-grow: 0;
            flex-shrink: 0;
            margin-right: 10px;
            letter-spacing: 1px;
        }

        #posts .post div.subtype {
            flex-basis: 80px;
        }

        #posts .post div.name {
            font-size: 120%;
        }

        #posts .post div.description {
            color: #404040;
            padding-bottom: 8px;
        }
    `;

    const app = choo();
    app.use((state, emitter) => {
        state.openPage = null;
        state.openPageData = null;
        state.pages = null;
        state.posts = null;

        Promise.all([
            getConfig('./assets/posts.json'),
            getConfig('./assets/pages.json')
        ]).then((data) => {
            state.posts = data[0];
            state.pages = data[1];
            emitter.emit('render');
        });
    });
    app.route('/', mainView);
    app.route('#impressum', impressumView);
    app.route('#datenschutz', datenschutzView);
    app.route('#blog/:post', blogPostView);
    app.route('#pages/:page', githubProjectView);
    app.route('#link/:page', iframeLinkView);

    app.mount('body');

    function getGithubReadme (path) {
        const fetchParams = {
            headers: {
                Accept: 'application/vnd.github.VERSION.raw'
            }
        };
        return fetch(path, fetchParams).then((response) => response.text());
    }

    function getConfig (path) {
        return fetch(path).then((response) => response.json());
    }

    function getBlogPost (path) {
        return fetch(path).then((response) => response.text());
    }

    function impressumView (state, emit) {
        return html`<body class=${body}>
            ${navigationView(state, emit)}
            <main class="blog">
                <h3>Impressum moszeed.de</h3>
                <div>Michael Röber, Nauestraße 11, 06132 Halle (Saale)</div>
                <div>E-Mail: <a href="mailto:moszeed@gmail.com">moszeed@gmail.com</a></div>
            </main>
        </body>`;
    }

    function datenschutzView (state, emit) {
        return html`<body class=${body}>
            ${navigationView(state, emit)}
            <main class="blog">
                <h1>Datenschutzerklärung</h1>
                <h2>Datenschutz</h2>
                <p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>
                <p>Die Nutzung unserer Website ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder E-Mail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben.</p>
                <p>Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.</p>
                <p> </p>
                <h2>Cookies</h2> <p>Die Internetseiten verwenden teilweise so genannte Cookies. Cookies richten auf Ihrem Rechner keinen Schaden an und enthalten keine Viren. Cookies dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen. Cookies sind kleine Textdateien, die auf Ihrem Rechner abgelegt werden und die Ihr Browser speichert.</p>
                <p>Die meisten der von uns verwendeten Cookies sind so genannte „Session-Cookies“. Sie werden nach Ende Ihres Besuchs automatisch gelöscht. Andere Cookies bleiben auf Ihrem Endgerät gespeichert, bis Sie diese löschen. Diese Cookies ermöglichen es uns, Ihren Browser beim nächsten Besuch wiederzuerkennen.</p>
                <p>Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell ausschlie&szlig;en sowie das automatische Löschen der Cookies beim Schlie&szlig;en des Browser aktivieren. Bei der Deaktivierung von Cookies kann die Funktionalität dieser Website eingeschränkt sein.</p>
                <p> </p>
                <h2>Server-LogFiles</h2> <p>Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log Files, die Ihr Browser automatisch an uns übermittelt. Dies sind:</p>
                <ul> <li>Browsertyp und Browserversion</li> <li>verwendetes Betriebssystem</li> <li>Referrer URL</li> <li>Hostname des zugreifenden Rechners</li> <li>Uhrzeit der Serveranfrage</li> </ul> <p>Diese Daten sind nicht bestimmten Personen zuordenbar. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Wir behalten uns vor, diese Daten nachträglich zu prüfen, wenn uns konkrete Anhaltspunkte für eine rechtswidrige Nutzung bekannt werden.</p>
                <p> </p>
                <h2>Kontaktformular</h2> <p>Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.</p>
                <p> </p>
                <h2>Newsletterdaten</h2> <p>Wenn Sie den auf der Website angebotenen Newsletter beziehen möchten, benötigen wir von Ihnen eine E-Mail-Adresse sowie Informationen, welche uns die überprüfung gestatten, dass Sie der Inhaber der angegebenen E-Mail-Adresse sind und mit dem Empfang des Newsletters einverstanden sind. Weitere Daten werden nicht erhoben. Diese Daten verwenden wir ausschlie&szlig;lich für den Versand der angeforderten Informationen und geben sie nicht an Dritte weiter.</p>
                <p>Die erteilte Einwilligung zur Speicherung der Daten, der E-Mail-Adresse
                sowie deren Nutzung zum Versand des Newsletters können Sie jederzeit widerrufen, etwa über den "Austragen"-Link im Newsletter.</p>
                <p> </p>
                <h2>Google Analytics</h2> <p>Diese Website nutzt Funktionen des Webanalysedienstes Google Analytics. Anbieter ist die Google Inc., 1600 Amphitheatre Parkway Mountain View, CA 94043, USA.</p>
                <p>Google Analytics verwendet so genannte "Cookies". Das sind Textdateien, die auf Ihrem Computer gespeichert werden und die eine Analyse der Benutzung der Website durch Sie ermöglichen. Die durch den Cookie erzeugten Informationen über Ihre Benutzung dieser Website werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert.</p>
                <p><strong>IP Anonymisierung</strong></p>
                <p>Wir haben auf dieser Website die Funktion IP-Anonymisierung aktiviert. Dadurch wird Ihre IP-Adresse von Google innerhalb von Mitgliedstaaten der Europäischen Union oder in anderen Vertragsstaaten des Abkommens über den Europäischen Wirtschaftsraum vor der übermittlung in die USA gekürzt. Nur in Ausnahmefällen wird die volle IP-Adresse an einen Server von Google in den USA übertragen und dort gekürzt. Im Auftrag des Betreibers dieser Website wird Google diese Informationen benutzen, um Ihre Nutzung der Website auszuwerten, um Reports über die Websiteaktivitäten zusammenzustellen und um weitere mit der Websitenutzung und der Internetnutzung verbundene Dienstleistungen gegenüber dem Websitebetreiber zu erbringen. Die im Rahmen von Google Analytics von Ihrem Browser übermittelte IP-Adresse wird nicht mit anderen Daten von Google zusammengeführt.</p>
                <p><strong>Browser Plugin</strong></p>
                <p>Sie können die Speicherung der Cookies durch eine entsprechende Einstellung Ihrer Browser-Software verhindern; wir weisen Sie jedoch darauf hin, dass Sie in diesem Fall gegebenenfalls nicht sämtliche Funktionen dieser Website vollumfänglich werden nutzen können. Sie können darüber hinaus die Erfassung der durch den Cookie erzeugten und auf Ihre Nutzung der Website bezogenen Daten (inkl. Ihrer IP-Adresse) an Google sowie die Verarbeitung dieser Daten durch Google verhindern, indem Sie das unter dem folgenden Link verfügbare Browser-Plugin herunterladen und installieren: <a href="https://tools.google.com/dlpage/gaoptout?hl=de" target="_blank">https://tools.google.com/dlpage/gaoptout?hl=de</a></p>
                <p><strong>Widerspruch gegen Datenerfassung</strong></p>
                <p>Sie können die Erfassung Ihrer Daten durch Google Analytics verhindern, indem Sie auf folgenden Link klicken. Es wird ein Opt-Out-Cookie gesetzt, der die Erfassung Ihrer Daten bei zukünftigen Besuchen dieser Website verhindert: <a href="javascript:gaOptout();">Google Analytics deaktivieren</a></p>
                <p>Mehr Informationen zum Umgang mit Nutzerdaten bei Google Analytics finden Sie in der Datenschutzerklärung von Google: <a href="https://support.google.com/analytics/answer/6004245?hl=de" target="_blank">https://support.google.com/analytics/answer/6004245?hl=de</a></p>
                <p> </p>
                <h2>Twitter</h2> <p>Auf unseren Seiten sind Funktionen des Dienstes Twitter eingebunden. Diese Funktionen werden angeboten durch die Twitter Inc., 1355 Market Street, Suite 900, San Francisco, CA 94103, USA. Durch das Benutzen von Twitter und der Funktion "Re-Tweet" werden die von Ihnen besuchten Websites mit Ihrem Twitter-Account verknüpft und anderen Nutzern bekannt gegeben. Dabei werden auch Daten an Twitter übertragen. Wir weisen darauf hin, dass wir als Anbieter der Seiten keine Kenntnis vom Inhalt der übermittelten Daten sowie deren Nutzung durch Twitter erhalten. Weitere Informationen hierzu finden Sie in der Datenschutzerklärung von Twitter unter <a href="https://twitter.com/privacy" target="_blank">https://twitter.com/privacy</a>.</p>
                <p>Ihre Datenschutzeinstellungen bei Twitter können Sie in den Konto-Einstellungen unter: <a href="https://twitter.com/account/settings" target="_blank">https://twitter.com/account/settings</a> ändern.</p>
                <p> </p>
                <h2>Google+</h2> <p>Unsere Seiten nutzen Funktionen von Google+. Anbieter ist die Google Inc., 1600 Amphitheatre Parkway Mountain View, CA 94043, USA.</p>
                <p>Erfassung und Weitergabe von Informationen: Mithilfe der Google+-Schaltfläche können Sie Informationen weltweit veröffentlichen. über die Google+-Schaltfläche erhalten Sie und andere Nutzer personalisierte Inhalte von Google und unseren Partnern. Google speichert sowohl die Information, dass Sie für einen Inhalt +1 gegeben haben, als auch Informationen über die Seite, die Sie beim Klicken auf +1 angesehen haben. Ihre +1 können als Hinweise zusammen mit Ihrem Profilnamen und Ihrem Foto in Google-Diensten, wie etwa in Suchergebnissen oder in Ihrem Google-Profil, oder an anderen Stellen auf Websites und Anzeigen im Internet eingeblendet werden.</p>
                <p>Google zeichnet Informationen über Ihre +1-Aktivitäten auf, um die Google-Dienste für Sie und andere zu verbessern. Um die Google+-Schaltfläche verwenden zu können, benötigen Sie ein weltweit sichtbares, öffentliches Google-Profil, das zumindest den für das Profil gewählten Namen enthalten muss. Dieser Name wird in allen Google-Diensten verwendet. In manchen Fällen kann dieser Name auch einen anderen Namen ersetzen, den Sie beim Teilen
                von Inhalten über Ihr Google-Konto verwendet haben. Die Identität Ihres Google-Profils kann Nutzern angezeigt werden, die Ihre E-Mail-Adresse kennen oder über andere identifizierende Informationen von Ihnen verfügen.</p>
                <p>Verwendung der erfassten Informationen: Neben den oben erläuterten Verwendungszwecken werden die von Ihnen bereitgestellten Informationen gemä&szlig; den geltenden Google-Datenschutzbestimmungen genutzt. Google veröffentlicht möglicherweise zusammengefasste Statistiken über die +1-Aktivitäten der Nutzer bzw. gibt diese an Nutzer und Partner weiter, wie etwa Publisher, Inserenten oder verbundene Websites.</p>
                <p> </p>
                <h2>Instagram</h2> <p>Auf unseren Seiten sind Funktionen des Dienstes Instagram eingebunden. Diese Funktionen werden angeboten durch die Instagram Inc., 1601 Willow Road, Menlo Park, CA, 94025, USA integriert. Wenn Sie in Ihrem Instagram-Account eingeloggt sind können Sie durch Anklicken des Instagram-Buttons die Inhalte unserer Seiten mit Ihrem InstagramProfil verlinken. Dadurch kann Instagram den Besuch unserer Seiten Ihrem Benutzerkonto zuordnen. Wir weisen darauf hin, dass wir als Anbieter der Seiten keine Kenntnis vom Inhalt der u?bermittelten Daten sowie deren Nutzung durch Instagram erhalten.</p>
                <p>Weitere Informationen hierzu finden Sie in der Datenschutzerklärung von Instagram: <a href="https://instagram.com/about/legal/privacy/" target="_blank">https://instagram.com/about/legal/privacy/</a></p>
                <p> </p>
                <h2>Pinterest</h2> <p>Auf unserer Seite verwenden wir Social Plugins des sozialen Netzwerkes Pinterest, das von der Pinterest Inc., 808 Brannan Street San Francisco, CA 94103-490, USA ("Pinterest") betrieben wird. Wenn Sie eine Seite aufrufen, die ein solches Plugin enthält, stellt Ihr Browser eine direkte Verbindung zu den Servern von Pinterest her. Das Plugin übermittelt dabei Protokolldaten an den Server von Pinterest in die USA. Diese Protokolldaten enthalten möglicherweise Ihre IP-Adresse, die Adresse der besuchten Websites, die ebenfalls Pinterest-Funktionen enthalten, Art und Einstellungen des Browsers, Datum und Zeitpunkt der Anfrage, Ihre Verwendungsweise von Pinterest sowie Cookies.</p>
                <p>Weitere Informationen zu Zweck, Umfang und weiterer Verarbeitung und Nutzung der Daten durch Pinterest sowie Ihre diesbezüglichen Rechte und Möglichkeiten zum Schutz Ihrer Privatsphäre finden Sie in den den Datenschutzhinweisen von Pinterest: <a href="https://about.pinterest.com/de/privacy-policy" target="_blank">https://about.pinterest.com/de/privacypolicy</a></p>
                <p> </p>
                <h2>SoundCloud</h2> <p>Auf unseren Seiten können Plugins des sozialen Netzwerks SoundCloud (SoundCloud Limited, Berners House, 47-48 Berners Street, London W1T 3NF, Gro&szlig;britannien.) integriert sein. Die SoundCloud-Plugins erkennen Sie an dem SoundCloud-Logo auf den betroffenen Seiten.</p>
                <p>Wenn Sie unsere Seiten besuchen, wird nach Aktivierung des Plugin eine direkte Verbindung zwischen Ihrem Browser und dem SoundCloud-Server hergestellt. SoundCloud erhält dadurch die Information, dass Sie mit Ihrer IP-Adresse unsere Seite besucht haben. Wenn Sie den "Like-Button" oder "Share-Button" anklicken während Sie in Ihrem SoundCloud- Benutzerkonto eingeloggt sind, können Sie die Inhalte unserer Seiten mit Ihrem SoundCloud-Profil verlinken und/oder teilen. Dadurch kann SoundCloud Ihrem Benutzerkonto den Besuch unserer Seiten zuordnen. Wir weisen darauf hin, dass wir als Anbieter der Seiten keine Kenntnis vom Inhalt der übermittelten Daten sowie deren Nutzung durch SoundCloud erhalten. Weitere Informationen hierzu finden Sie in der Datenschutzerklärung von SoundCloud unter: <a href="https://soundcloud.com/pages/privacy" target="_blank">https://soundcloud.com/pages/privacy</a></p>
                <p>Wenn Sie nicht wünschen, dass Soundcloud den Besuch unserer Seiten Ihrem SoundCloud- Benutzerkonto zuordnet, loggen Sie sich bitte aus Ihrem SoundCloud-Benutzerkonto aus bevor Sie Inhalte des SoundCloud-Plugins aktivieren.</p><p> </p> <h2>Spotify</h2> <p>Auf unseren Seiten sind Funktionen des MusikDienstes Spotify eingebunden. Anbieter ist die Spotify AB, Birger Jarlsgatan 61, 113 56 Stockholm in Schweden. Die Spotify PlugIns erkennen Sie an dem grünen Logo auf unserer Seite. Eine übersicht über die Spotify-PlugIns finden Sie unter <a href="https://developer.spotify.com" target="_blank">https://developer.spotify.com</a></p> <p>Dadurch kann beim Besuch unserer Seiten über das Plugin eine direkte Verbindung zwischen Ihrem Browser und dem Spotify-Server hergestellt werden. Spotify erhält dadurch die Information, dass Sie mit Ihrer IP-Adresse unsere Seite besucht haben. Wenn Sie den Spotify Button anklicken während Sie in Ihrem Spotify-Account eingeloggt sind, können Sie die Inhalte unserer Seiten auf Ihrem Spotify Profil verlinken. Dadurch kann Spotify den Besuch unserer Seiten Ihrem Benutzerkonto zuordnen.</p> <p>Weitere Informationen hierzu finden Sie in der Datenschutzerklärung von Spotify: <a href="https://www.spotify.com/de/legal/privacy-policy/" target="_blank">https://www.spotify.com/de/legal/privacy-policy/</a></p> <p>Wenn Sie nicht wünschen, dass Spotify den Besuch unserer Seiten Ihrem Spotify-Nutzerkonto zuordnen kann,
                loggen Sie sich bitte aus Ihrem Spotify-Benutzerkonto aus.</p><p> </p> <h2>YouTube</h2> <p>Unsere Website nutzt Plugins der von Google betriebenen Seite YouTube. Betreiber der Seiten ist die YouTube, LLC, 901 Cherry Ave., San Bruno, CA 94066, USA. Wenn Sie eine unserer mit einem YouTubePlugin ausgestatteten Seiten besuchen, wird eine Verbindung zu den Servern von YouTube hergestellt. Dabei wird dem Youtube-Server mitgeteilt, welche unserer Seiten Sie besucht haben.</p> <p>Wenn Sie in Ihrem YouTube-Account eingeloggt sind ermöglichen Sie YouTube, Ihr Surfverhalten direkt Ihrem persönlichen Profil zuzuordnen. Dies können Sie verhindern, indem Sie sich aus Ihrem YouTube-Account ausloggen.</p> <p>Weitere Informationen zum Umgang von Nutzerdaten finden Sie in der Datenschutzerklärung von YouTube unter: <a href="https://www.google.de/intl/de/policies/privacy" target="_blank">https://www.google.de/intl/de/policies/privacy</a></p><p> </p> <h2>SSLVerschlüsselung</h2> <p>Diese Seite nutzt aus Gründen der Sicherheit und zum Schutz der übertragung vertraulicher Inhalte, wie zum Beispiel der Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von "http://" auf "https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.</p> <p>Wenn die SSL Verschlüsselung aktiviert ist, können die Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen werden.</p><p> </p> <h2>Recht auf Auskunft, Löschung, Sperrung</h2> <p>Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden.</p><p> </p> <p>Quelle: <a href="https://www.e-recht24.de/musterdatenschutzerklaerung.html">https://www.e-recht24.de/muster-datenschutzerklaerung.html</a></p>
            </main>
        </body>`;
    }

    function iframeLinkView (state, emit) {
        if (!state.pages) {
            return html`<body class=${body}>
                ${navigationView(state, emit)}
                <main class="blog"></main>
            </body>`;
        }

        let pageItem = state.pages[state.params.page];

        return html`<body class=${body}>
            ${navigationView(state, emit)}
            <main class="externalLink">
                <iframe src="${pageItem.link}">
            </main>
        </body>`;
    }

    function githubProjectView (state, emit) {
        if (!state.pages) {
            return html`<body class=${body}>
                ${navigationView(state, emit)}
                <main class="blog"></main>
            </body>`;
        }

        let pageItem = state.pages[state.params.page];
        let $externalContent = html`<div></div>`;

        if (state.openPage !== state.params.page) {
            state.openPage = state.params.page;
            state.openPageData = null;
        }

        if (!state.openPageData) {
            getGithubReadme(pageItem.readme).then((data) => {
                state.openPageData = data;
                emit('render');
            });
        } else {
            $externalContent.innerHTML = markdown.render(state.openPageData);
        }

        return html`<body class=${body}>
            ${navigationView(state, emit)}
            <main class="blog">
                <section>
                    open on Github: <a href="${pageItem.link}" target="_blank">${pageItem.link}</a>
                </section>
                <hr>
                <section class="external">${$externalContent}</section>
            </main>
        </body>`;
    }

    function blogPostView (state, emit) {
        if (!state.posts) {
            return html`<body class=${body}>
                ${navigationView(state, emit)}
                <main class="blog"></main>
            </body>`;
        }

        let postItem = state.posts.find((post) => post.key === state.params.post);
        if (!postItem) {
            postItem = state.pages[state.params.post];
        }

        let $externalContent = html`<div></div>`;

        if (state.openPage !== state.params.post) {
            state.openPage = state.params.post;
            state.openPageData = null;
        }

        if (!state.openPageData) {
            getBlogPost(postItem.link).then((data) => {
                state.openPageData = data;
                emit('render');
            });
        } else {
            $externalContent.innerHTML = markdown.render(state.openPageData);
        }

        return html`<body class=${body}>
            ${navigationView(state, emit)}
            <main class="blog">${$externalContent}</main>
        </body>`;
    }

    function navigationView (state, emit) {
        if (!state.pages) {
            return html`<nav>
                <p><span>Hi and welcome, i am Moszeed, from Germany. I love to write Code, to create Apps, Pages and Modules.</span></p>
                <ul>
                    <li onclick=${backToList}>.index</li>
                </ul>
                <div id="impressum">
                    <a href="#impressum">Impressum</a>
                    <a href="#datenschutz">Datenschutz</a>
                </div>
            </nav>`;
        }

        const $pages = Object.keys(state.pages)
            .filter((key) => state.pages[key].type === 'link')
            .map((key) => html`<li onclick=${() => openIFrameLink(key)}>.${state.pages[key].name}</li>`);

        const $projects = Object.keys(state.pages)
            .filter((key) => state.pages[key].type === 'github')
            .map((key) => html`<li onclick=${() => setOpenPage(key)}>.${state.pages[key].name}</li>`);

        const $unity = Object.keys(state.pages)
            .filter((key) => state.pages[key].type === 'unity')
            .map((key) => html`<li onclick=${() => openBlogPage(key)}>.${state.pages[key].name}</li>`);

        const $drawing = Object.keys(state.pages)
            .filter((key) => state.pages[key].type === 'drawing')
            .map((key) => html`<li onclick=${() => openBlogPage(key)}>.${state.pages[key].name}</li>`);

        const $other = Object.keys(state.pages)
            .filter((key) => state.pages[key].type === 'other')
            .map((key) => html`<li onclick=${() => openBlogPage(key)}>.${state.pages[key].name}</li>`);

        const $projectList = html`<section>
            <ul>
                <li onclick=${backToList}>.index</li>
            </ul>
            <ul class="pages">
                ${$pages}
            </ul>
            <h4>.projects</h4>
            <ul class="project">
                ${$projects}
            </ul>
            <h4>.drawing</h4>
            <ul class="project">
                ${$drawing}
            </ul>
            <h4>.unity</h4>
            <ul class="project">
                ${$unity}
            </ul>
            <h4>.other</h4>
            <ul class="project">
                ${$other}
            </ul>
        </section>`;

        return html`<nav class="menu">
            <p><span>Hi and welcome, i am Moszeed, from Germany. I love to write Code, to create Apps, Pages and Modules.</span></p>
            ${$projectList}
            <div id="impressum">
                <a href="#impressum">Impressum</a>
                <a href="#datenschutz">Datenschutz</a>
            </div>
        </nav>`;

        function backToList () {
            emit('pushState', `/`);
        }

        function openIFrameLink (key) {
            emit('pushState', `#link/${key}`);
        }

        function setOpenPage (key) {
            emit('pushState', `#pages/${key}`);
        }

        function openBlogPage (key) {
            emit('pushState', `#blog/${key}`);
        }
    }

    function blogPostsListView (state, emit) {
        if (!state.posts) {
            return '';
        }

        const sortedPosts = state.posts.sort((a, b) =>
            collator.compare(Date.parse(b.created), Date.parse(a.created)));

        const $liGroups = sortedPosts.map((postItem) => {
            const subType = postItem.subtype ? `[${postItem.subtype}] ` : '';
            return html`<div class="post" onclick=${() => setOpenPage(postItem.key)}>
                <div class="created">${new Date(postItem.created).toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                <div>
                    <div class="name">${subType}${postItem.name}</div>
                    <div class="description">${postItem.description}</div>
                </div>
            </div>`;
        });

        return html`<div id="posts">${$liGroups}</div>`;


        function setOpenPage (key) {
            emit('pushState', `#blog/${key}`);
        }
    }

    function mainView (state, emit) {
        const $social = html`<section>

        </section>`;

        return html`<body class=${body}>
            ${navigationView(state, emit)}
            <main>
                <section>
                    <h3>Posts</h3>
                    ${blogPostsListView(state, emit)}
                </section>
                ${$social}
            </main>
        </body>`;
    }
})();
