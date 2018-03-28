(() => {
    'use strict';

    const html = require('choo/html');
    const devtools = require('choo-devtools');
    const css = require('sheetify');
    const choo = require('choo');
    const markdown = require('markdown-it')();

    const posts = {
        'jsconfeu2013recap': {
            'type'       : 'blog',
            'name'       : 'JSConf EU 2013',
            'created'    : '18. August 2013',
            'description': 'a collection of videos from jsconfeu 2013',
            'link'       : './assets/blog/jsconfeu2013recap.md'
        },
        'rejectjs2013recap': {
            'type'       : 'blog',
            'name'       : 'Reject.js 2013',
            'created'    : '18. August 2013',
            'description': 'a collection of videos from rejectjs 2013',
            'link'       : './assets/blog/rejectjs2013recap.md'
        },
        'npmasbuildtool': {
            'type'       : 'blog',
            'name'       : 'NPM Scripts (German)',
            'created'    : '29. Mai 2016',
            'description': 'how to use the "scripts" in npm',
            'link'       : './assets/blog/npmasbuildtool.md'
        },
        'practicalphparrayfunctions': {
            'type'       : 'blog',
            'name'       : 'Practical PHP Array Functions (German)',
            'created'    : '03. August 2016',
            'description': 'some dev-life saving PHP Array functions',
            'link'       : './assets/blog/practicalphparrayfunctions.md'
        },
        'unityressources': {
            'type'       : 'blog',
            'name'       : 'Unity Ressources',
            'created'    : '28. März 2018',
            'description': 'ressources like models, animations, textures ...',
            'link'       : './assets/blog/unityressources.md'
        }
    };

    const pages = {
        'easysoap': {
            'type'       : 'github',
            'name'       : 'EasySoap',
            'description': 'a SOAP Client for Node.js',
            'link'       : 'https://github.com/moszeed/easysoap',
            'readme'     : 'https://api.github.com/repos/moszeed/easysoap/readme'
        },
        'kindleperiodical': {
            'type'       : 'github',
            'name'       : 'KindlePeriodical',
            'description': 'create a kindle periodical book with Node.js',
            'link'       : 'https://github.com/moszeed/kindle-periodical',
            'readme'     : 'https://api.github.com/repos/moszeed/kindle-periodical/readme'
        },
        'incrementallify': {
            'type'       : 'github',
            'name'       : 'Incrementallify',
            'description': 'browserify builds with a persistent cache between runtimes',
            'link'       : 'https://github.com/moszeed/incrementallify',
            'readme'     : 'https://api.github.com/repos/moszeed/incrementallify/readme'
        }
    };

    const body = css`
        :host {
            display: grid;
            grid-template-columns: 200px auto;
            grid-template-rows: auto;
        }

        html, body {
            padding: 0;
            margin: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            font-size: 1em;
            font-family: Helvetica, Arial, FreeSans, sans-serif;
        }

        nav {
            color: #EFEFEF;
            background-color: #121212;
            padding: 10px;
        }

        nav p {
            letter-spacing: 1px;
            font-size: 80%;
        }

        nav h4 {
            margin-bottom: 4px;
        }

        ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        ul li span.created {
            font-weight: bold;
            width: 140px;
            display: inline-block;
        }

        ul li span.name {
            margin-left: 20px;
        }

        ul li span.description {
            font-size: 90%;
            margin-left: 20px;
        }

        nav ul.project {
            margin-left: 10px;
        }

        nav hr {
            border: 1px solid #363636;
        }

        nav ul li {
            color: #EFEFEF;
            margin-bottom: 4px;
            text-transform: lowercase;
        }

        section ul li {
            margin-bottom: 6px;
        }

        section ul li:hover {
            cursor: pointer;
            text-decoration: underline;
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
        }

        #impressum a {
            color: #626262;
            font-size: 12px;
            text-decoration: none;
        }

        main {
            background-color: #FEFEFE;
            padding: 10px 20px;
            overflow: auto;
            box-shadow: 4px 0px 6px inset #333333;
        }
    `;

    const app = choo();
    // app.use(devtools());
    app.use((state, emit) => {
        state.openPage = null;
        state.openPageData = null;
    });
    app.route('/', mainView);
    app.route('#impressum', impressumView);
    app.route('#blog/:post', blogPostView);
    app.route('#pages/:page', githubProjectView);

    app.mount('body');

    function getGithubReadme (path) {
        const fetchParams = {
            headers: {
                Accept: 'application/vnd.github.VERSION.raw'
            }
        };
        return fetch(path, fetchParams).then((response) => response.text());
    }

    function getBlogPost (path) {
        return fetch(path).then((response) => response.text());
    }

    function impressumView (state, emit) {
        return html`<body class=${body}>
            ${navigationView(state, emit)}
            <main>
                <h3>Impressum moszeed.de</h3>
                <div>Michael Röber, Nauestraße 11, 06132 Halle (Saale)</div>
                <div>E-Mail: <a href="mailto:moszeed@gmail.com">moszeed@gmail.com</a></div>
            </main>
        </body>`;
    }

    function githubProjectView (state, emit) {
        let pageItem = pages[state.params.page];
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
            <main class="blog">${$externalContent}</main>
        </body>`;
    }

    function blogPostView (state, emit) {
        let postItem = posts[state.params.post];
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
        const $liArray = Object.keys(pages)
            .map((key) => html`<li onclick=${() => setOpenPage(key)}>.${pages[key].name}</li>`)
            .filter(Boolean);

        return html`<nav>
            <h3>.about</h3>
            <p>Hi and welcome, i am Moszeed, from Germany. I love to write Code, to create Apps, Pages and Modules.</p>
            <hr><br>
            <ul>
                <li onclick=${backToList}>.index</li>
            </ul>
            <h4>.pages</h4>
            <ul class="project">
                ${$liArray}
            </ul>
            <div id="impressum">
                <a href="#impressum">Impressum</a>
            </div>
        </nav>`;

        function backToList () {
            emit('pushState', `/`);
        }

        function setOpenPage (key) {
            emit('pushState', `#pages/${key}`);
        }
    }

    function blogPostsListView (state, emit) {
        const $liArray = Object.keys(posts)
            .reverse()
            .map((key) => html`
                <li onclick=${() => setOpenPage(key)}>
                    <span class="created">${posts[key].created}</span>
                    <span class="name">${posts[key].name}</span>
                    <span class="description">${posts[key].description}</span>
                </li>`)
            .filter(Boolean);

        return html`<ul>${$liArray}</ul>`;

        function setOpenPage (key) {
            emit('pushState', `#blog/${key}`);
        }
    }

    function mainView (state, emit) {
        return html`<body class=${body}>
            ${navigationView(state, emit)}
            <main>
                <section>
                    <h3>Posts</h3>
                    ${blogPostsListView(state, emit)}
                </section>
            </main>
        </body>`;
    }
})();
