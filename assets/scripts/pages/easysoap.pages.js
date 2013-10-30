var Easysoap = {};

    Easysoap.View = Backbone.View.extend({

        el : '#main.easysoap',

        initialize : function () {

        },

        render : function() {

            var that = this;
            $.ajax({
                url : 'https://api.github.com/repos/moszeed/easysoap/readme',
                headers : {
                    Accept : 'application/vnd.github.VERSION.raw'
                },
                success : function(data) {
                    that.$el.find('#npm_description').html('<pre>' + data + '</pre>');
                }
            });
        }

    });