(() => {
    'use strict';

    const html = require('choo/html');
    const css = require('sheetify');
    const choo = require('choo');
    const markdown = require('markdown-it')();

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
            padding: 10px;
            background-color: #DEDEDE;
        }

        ul li div.name {
            margin-left: 20px;
            font-weight: bold;
        }

        ul li div.description {
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
        }

        #impressum a {
            color: #626262;
            font-size: 12px;
            text-decoration: none;
        }

        pre {
            background: #f4f4f4;
            border: 1px solid #ddd;
            border-left: 3px solid #f36d33;
            color: #666;
            page-break-inside: avoid;
            font-family: monospace;
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 1.6em;
            max-width: 100%;
            overflow: auto;
            padding: 1em 1.5em;
            display: block;
            word-wrap: break-word;
        }

        main {
            background-color: #FEFEFE;
            padding: 10px 30px;
            overflow: auto;
            box-shadow: 4px 0px 6px inset #333333;
            display: grid;
            grid-template-columns: auto 400px;
            grid-template-rows: auto;
            overflow: hidden;
        }

        main section {
            overflow: auto;
            padding: 10px;
        }

        main.blog {
            display: block;
        }

        main.blog section.external {
            background-color: #FBFBFB;
            padding: 20px;
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

    function getConfig(path) {
        return fetch(path).then((response) => response.json());
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

        let postItem = state.posts[state.params.post];
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
        let $projectList = '';

        if (state.pages) {
            const $liArray = Object.keys(state.pages)
                .map((key) => html`<li onclick=${() => setOpenPage(key)}>.${state.pages[key].name}</li>`)
                .filter(Boolean);

            $projectList = html`<section>
                <h4>.pages</h4>
                <ul class="project">
                    ${$liArray}
                </ul>
            </section>`;
        }

        const $navigation = html`<nav>
            <h3>.about</h3>
            <p>Hi and welcome, i am Moszeed, from Germany. I love to write Code, to create Apps, Pages and Modules.</p>
            <hr><br>
            <ul>
                <li onclick=${backToList}>.index</li>
            </ul>
            ${$projectList}
            <div id="impressum">
                <a href="#impressum">Impressum</a>
            </div>
        </nav>`;

        return $navigation;

        function backToList () {
            emit('pushState', `/`);
        }

        function setOpenPage (key) {
            emit('pushState', `#pages/${key}`);
        }
    }

    function blogPostsListView (state, emit) {
        if (!state.posts) {
            return '';
        }
        const reversedPostsKeys = Object.keys(state.posts).reverse();
        const $liGroups = reversedPostsKeys.reduce((store, key) => {
            let postItem = state.posts[key];
            if (postItem) {
                if (!postItem.subtype) postItem.subtype = 'default';
                if (!store[postItem.subtype]) store[postItem.subtype] = [];

                let $li = html`
                <li onclick=${() => setOpenPage(key)}>
                    <span class="created">${postItem.created}</span>
                    <span>
                        <div class="name">${postItem.name}</div>
                        <div class="description">${postItem.description}</div>
                    </span>
                </li>`;

                store[postItem.subtype].push($li);
            }

            return store;
        }, {});

        return html`<div>
            <ul>${$liGroups.default}</ul>
            <hr>
            <h5>PHP</h5>
            <ul>${$liGroups.php}</ul>
            <hr>
            <h5>Unity 3D</h5>
            <ul>${$liGroups.unity}</ul>
        </div>`;

        function setOpenPage (key) {
            emit('pushState', `#blog/${key}`);
        }
    }

    function mainView (state, emit) {
        const $social = html`<section>
            <h3>Social</h3>
            <h5>YouTube Likes</h5>
            <iframe width="370" height="300" src="https://www.youtube.com/embed/videoseries?list=LLIP3PUKG7eeAkbf8Rwbhz8g" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            <h5>Pinterest Likes</h5>
            <a data-pin-do="embedUser" data-pin-board-width="350" data-pin-scale-height="400" data-pin-scale-width="115" href="https://www.pinterest.com/moszeed/"></a>
            <script async defer src="//assets.pinterest.com/js/pinit.js"></script>
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
