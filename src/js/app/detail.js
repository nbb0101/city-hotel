require(['jquery', 'getRequest', 'render'], function($, getRequest, render) {
    // console.log(getRequest().id);
    var id = getRequest().id;
    $.ajax({
        url: '/API/detail',
        dataType: 'json',
        data: {
            id: id
        },
        success: function(res) {
            if (res.code == 1) {
                render('#detail-tpl', res.data[0], 'main');
            }
        },
        error: function(error) {
            console.warn(error);
        }
    })
})