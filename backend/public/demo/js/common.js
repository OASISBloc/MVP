$(document).ready(function(){
    
    navSlide();
    navBtn();
    btnTop();

});

//nav slide
function navSlide(){
    var cont = $('.container article'),
        nav = $('nav'),
        headerH = $('header').outerHeight();
    $(window).on('scroll', function() {
        var pos = $(this).scrollTop();            
        cont.each(function() {
            var top = $(this).offset().top;
            var menuTit = $('header h1');
            if (pos >= (top - headerH)) {
                nav.find('a').removeClass('on');
                nav.find('a[href="#' + $(this).attr('id') + '"]').addClass('on');
                menuTit.text(nav.find('a[href="#' + $(this).attr('id') + '"]').text());
            } else if (pos < $('.collection-area').offset().top - headerH) {
                menuTit.html('OASISBloc <em>Demo</em>');
            }
        });
    });

    nav.find('ul a').on('click', function(e) {
        e.preventDefault();
        var path = $(this).attr('href');
        var offset = $(path).offset().top - headerH;

        $('html, body').stop().animate({
            scrollTop: offset
        },500,"easeOutQuad");
    });
    
    $('.btn-next-step.slide').on('click', function(e) {
        e.preventDefault();
        var path = $(this).attr('href');
        var offset = $(path).offset().top - headerH;

        $('html, body').stop().animate({
            scrollTop: offset
        },500,"easeOutQuad");
    });
}

//nav
function navBtn(){
    $('.btn-nav').on('click',function(){
        var navMenu = $('header nav');
        $(this).toggleClass('on');
        if($(this).is('.on')){
            navMenu.stop().animate({
                'top' : '0'
            },300,"easeOutQuad");
            $('header .header-in').append('<span class="dim"></span>');
        } else {
            navMenu.stop().animate({
                'top' : '-100%'
            },150,"easeOutQuad");
            $('header .header-in .dim').remove();
        }

        var navBtn =  $('header nav a');
        navBtn.on('click',function(){
            $('.btn-nav').removeClass('on');
            navMenu.stop().animate({
                'top' : '-100%'
            },150,"easeOutQuad");
            $('header .header-in .dim').remove();
        });

        var clsBtn =  $('header nav .btn-cls');
        clsBtn.on('click',function(){
            $('.btn-nav').removeClass('on');
            navMenu.stop().animate({
                'top' : '-100%'
            },300,"easeOutQuad");
            $('header .header-in .dim').remove();
        });
    });
}

//tab
function tabActive(id){
	var idNum = id.replace('tabActive','');
	var tabWrapId = $('#tabWrap' + idNum);
	var btn = $('#' + id).find('a');
	var idx = $('#' + id).find('li.on').index();
	tabWrapId.find('> .tab-cont').hide().eq(idx).show();
	btn.on('click', function(e){
		var targetLink = $(this).attr('href');
		$(this).closest('li').addClass('on').siblings('li').removeClass('on');
		tabWrapId.find('> .tab-cont').hide();
		$(targetLink).show();
		e.preventDefault();
	});
}

//top
function btnTop(){
    $(window).on('scroll',function(){
        if($(this).scrollTop() > 300){
            $('.btn-top').show();
        } else {
            $('.btn-top').fadeOut();
        }
    });

    var btn = $('.btn-top');
    btn.on('click',function(){
        $('html, body').stop().animate({
            scrollTop: 0
        },500,"easeOutQuad", function() {
            try {
                window.Android.reLoad();
            } catch(err) {
                window.location.reload();    
            }
        });
    });
}

//레이어 팝업열기
function popupOpen(id){
	$(id).closest('.ly-wrap').show();
	var clientW = document.documentElement.clientWidth;
	var clientH = document.documentElement.clientHeight;
	var popupW = $(id).width();
	var popupH = $(id).height();
	
	$(id).css({
		'left' : (clientW-popupW)/2,
		'top' : (clientH-popupH)/2
	});
	$(window).resize(function(){
		var clientW = document.documentElement.clientWidth;
		var clientH = document.documentElement.clientHeight;
		var popupW = $(id).width();
		var popupH = $(id).height();
		$(id).css({
			'left' : (clientW-popupW)/2,
			'top' : (clientH-popupH)/2
		});
	});
}

//레이어 팝업닫기
function popupClose(e){
	$(e).closest('.ly-wrap:visible').hide();
}

