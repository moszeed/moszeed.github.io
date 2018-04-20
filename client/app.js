(() => {
    'use strict';

    const html = require('choo/html');
    const css = require('sheetify');
    const choo = require('choo');
    const markdown = require('markdown-it')();

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
            border-bottom: 1px solid #B6B6B6;
            background-color: #F0F0F0;
            padding: 8px;
        }

        nav {
            color: #EFEFEF;
            background-color: #121212;
            padding: 10px;
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
            grid-template-columns: auto 400px;
            grid-template-rows: auto;
        }

        main section {
            overflow: auto;
            padding: 10px;
        }

        main.blog {
            display: block;
            padding: 5% 10%;
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

        let postItem = state.posts[state.params.post] || state.pages[state.params.post];
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
                </div>
            </nav>`;
        }

        const $projects = Object.keys(state.pages)
            .filter((key) => state.pages[key].type === 'github')
            .map((key) => html`<li onclick=${() => setOpenPage(key)}>.${state.pages[key].name}</li>`);

        const $unity = Object.keys(state.pages)
            .filter((key) => state.pages[key].type === 'unity')
            .map((key) => html`<li onclick=${() => openBlogPage(key)}>.${state.pages[key].name}</li>`);

        const $other = Object.keys(state.pages)
            .filter((key) => state.pages[key].type === 'other')
            .map((key) => html`<li onclick=${() => openBlogPage(key)}>.${state.pages[key].name}</li>`);

        const $projectList = html`<section>
            <ul>
                <li onclick=${backToList}>.index</li>
            </ul>
            <h4>.projects</h4>
            <ul class="project">
                ${$projects}
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

        return html`<nav>
            <p><span>Hi and welcome, i am Moszeed, from Germany. I love to write Code, to create Apps, Pages and Modules.</span></p>
            ${$projectList}
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

        function openBlogPage (key) {
            emit('pushState', `#blog/${key}`);
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
