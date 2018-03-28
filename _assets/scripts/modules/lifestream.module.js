var LifeStream = {};

    LifeStream.View = Backbone.View.extend({

        el      : '#lifestream',
        list    : [{
                        service : "github",
                        user    : "moszeed"
                    }, {
                        service : "twitter",
                        user    : "moszeed"
                    }, {
                        service : "googleplus",
                        key     : "AIzaSyBFfPGCjTNKb1lb0VGHkW5404XyNrGRrPA",
                        user    : "100691045032903075638"
                    }],

        initialize : function() {
            //this.render();
        },

        render : function() {

            var that = this;
            $(this.$el).lifestream({
                limit   : 30,
                list    : that.list
            });
        }

    });