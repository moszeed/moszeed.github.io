var Start = {};

    Start.pageIndex = Backbone.View.extend({

        el          : '#main.start #pageIndex',

        events      : {

            'click li' : function(event) {

                var $target = $(event.target);
                if (($target)[0].nodeName !== 'li') {
                    $target = $target.parent();
                }

                Router.active.navigate('posts/' + $target.attr('class'), {
                    trigger : true
                });
            }
        },

        initialize  : function() {
            this.render();
        },

        render      : function() {

            var that = this;
                that.getConfig('posts')
                    .fail(function(error) { console.log(error); })
                    .done(function(data) {

                        var li = [];
                        _.each(data, function(item, key) {
                            li.push('<li class="' + item.name + '"><span class="create_date">' + item.create_date + '</span><span class="description">' + item.description + '</span></li>');
                        });

                        $(that.$el).html('<ul>' + li.join('') + '</ul>');
                    });
        }

    });

    Start.View = Backbone.View.extend({

        el          : '#main.start',
        initialize  : function() {

            var that = this;
                that.pageIndex = new Start.pageIndex();

        }
    });