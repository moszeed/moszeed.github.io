var SideBar = {};

    SideBar.View = Backbone.View.extend({

        el      : 'div#sidebar',
        events  : {

            'click li.index' : function() {
                Router.active.changePage('start');
            },

            'click li.easysoap' : function() {
                Router.active.changePage('easysoap');
            },

            'click li.backbone-dropbox' : function() {
                Router.active.changePage('backbone_dropbox');
            }
        }

    });

    SideBar.active = new SideBar.View();