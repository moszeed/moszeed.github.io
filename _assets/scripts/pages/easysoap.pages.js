var Easysoap = {};

    Easysoap.View = Backbone.View.extend({

        el : '#main.easysoap',

        initialize : function () {
            this.render();
        },

        render : function() {

            var that = this;
            $.ajax({
                url : 'https://api.github.com/repos/moszeed/easysoap/readme',
                headers : {
                    Accept : 'application/vnd.github.VERSION.raw'
                },
                success : function(data) {
                    that.$el.find('#github_readme').html(data);
                }
            });
        }

    });