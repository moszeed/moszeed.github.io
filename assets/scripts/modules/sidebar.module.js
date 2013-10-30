var SideBar = {};

    SideBar.View = Backbone.View.extend({

        el      : 'div#sidebar',
        events  : {

            'click li.index' : function() {
                Router.active.changePage('start');
            },

            'click li.easysoap' : function() {
                Router.active.changePage('easysoap');
            }
        }

    });

    SideBar.active = new SideBar.View();