var Router = {};

    Router.App = Backbone.Router.extend({

        startPage : 'start',

        routes : {

            'posts/:post_id' : function(id) {

                Main.active.render({
                    folder : false
                });
            },

            '*path' : 'default'
        },

        getCurrentPage  : function() {
            return Backbone.history.fragment;
        },

        refreshPage     : function() {
            Backbone.history.loadUrl(Backbone.history.fragment);
        },

        changePage      : function(pagename) {
            pagename = pagename || 'dashboard';
            Router.active.navigate(pagename, {
                trigger : true
            });
        },

        initialize      : function() {

            var that = this;
                that.on('route:default', function(path) {
                    that.navigate(path || that.startPage);
                    Main.active.render();
                });
        }
    });

    //init app
    $(document).ready(function() {

        Router.active = new Router.App();
        Backbone.history.start();
    });