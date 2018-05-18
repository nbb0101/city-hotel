require(['jquery', 'swiper', 'bscroll', 'render'], function($, swiper, bscroll, render) {

    var pagenum = 1;

    function loadSwiper() {
        $.ajax({
            url: '/API/swiperData',
            dataType: 'json',
            success: function(res) {
                if (res.code == 1) {
                    render('#swiper-tpl', res.data, '#_swiper');
                }
                new swiper('.banner', {
                    autoplay: 2000,
                    loop: true,
                    pagination: '.swiper-pagination',
                    autoplayDisableOnInteraction: false
                })
            },
            error: function(error) {
                console.log(error);
            }
        })

    };
    var listScroll = new bscroll('section', {
        scrollY: true,
        probeType: 2,
        click: true
    });
    var _parent = $('section main')
    listScroll.on('scroll', function() {
        // console.log(this.y);
        // console.log(this.maxScrollY);
        if (this.y < this.maxScrollY - 80) {
            _parent.attr('data', '释放加载更多...');
        } else if (this.y < this.maxScrollY - 40) {
            _parent.attr('data', '上拉加载更多...');
        }
    });
    listScroll.on('scrollEnd', function() {
        _parent.attr('data', '上拉加载更多...');
    });
    listScroll.on('touchEnd', function() {
        if (_parent.attr('data') === '释放加载更多...') {
            pagenum++;
            loadList(pagenum);
        }
    });

    function loadList(pagenum) {
        $.ajax({
            url: '/API/listData',
            dataType: 'json',
            data: {
                pagenum: pagenum
            },
            success: function(res) {
                if (res.code == 1) {
                    // console.log(res.data);
                    render('#list-tpl', res.data, '.list');
                    listScroll.refresh();
                }
            },
            error: function(error) {
                console.log(error);
            }
        })
    };



    function initPage() {
        loadSwiper();
        loadList(pagenum);

    };

    initPage();
});