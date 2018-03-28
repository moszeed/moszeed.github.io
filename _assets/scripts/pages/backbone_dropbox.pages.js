var Backbone_dropbox = {};

    Backbone_dropbox.View = Backbone.View.extend({

        el : '#main.backbone_dropbox',

        initialize : function () {
            this.render();
        },

        render : function() {

            var that = this;
            $.ajax({
                url : 'https://api.github.com/repos/jay-doubleyou/backbone-dropbox.js/readme',
                headers : {
                    Accept : 'application/vnd.github.VERSION.raw'
                },
                success : function(data) {
                    that.$el.find('#github_readme').html(data);
                }
            });
        }

    });