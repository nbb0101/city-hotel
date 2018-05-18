define(['jquery', 'handlebars'], function($, Handlebars) {
    function render(source, data, target) {
        var valus = $(source).html();
        var template = Handlebars.compile(valus);
        Handlebars.registerHelper('addIndex', function(index) {
            return index + 1;
        });
        var html = template(data);
        $(target).append(html);
    };
    return render;
});