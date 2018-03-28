var Main = {};

    Main.View = Backbone.View.extend({

        el          : '#main',
        render      : function(data) {

            data = data || {};

            if (data.folder === void 0) {
                data.folder = '/pages';
            }

            if (data.folder === false) {
                data.folder = '';
            }

            var that = this;
                that.$el.unbind();

            var page_name = Router.active.getCurrentPage();

            //render page and execute if available
            this.template({
                path    : './assets/templates' + data.folder + '/' + page_name + '.tpl.html',
                params  : data,
                success : function() {

                    that.$el
                        .removeClass()
                        .addClass(page_name);

                    var upperPageName = page_name.slice(0,1).toUpperCase() + page_name.slice(1);
                    if (window[upperPageName] && window[upperPageName].View) {
                        that.page = new window[upperPageName].View(data);
                    }
                }
            });
        }
    });

    Main.active = new Main.View();