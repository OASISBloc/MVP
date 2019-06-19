$(document).ready(function(){
    
    gnb();
    select();
    accordian();

});

//gnb
function gnb(){
    var btnGnb = $('header .m-menu');
    var gnb = $('aside');
    btnGnb.on('click', function(){
        gnb.addClass('visible');
        gnb.animate({
            'left' : '0'
        }, 500, 'easeOutQuart');
    });

    var btnCls = $('aside .btn-close');
    btnCls.on('click', function(){
        gnb.removeClass('visible');
        gnb.animate({
            'left' : '-100%'
        }, 300, 'easeOutQuart');
    });
}

//tabmenu
function tabFunc(id){
	var idNum = id.replace('tabActive','');
	var tabWrapId = $('#tabWrap' + idNum);
	var btn = $('#' + id).find('a');
	var idx = $('#' + id).find('li.active').index();
	tabWrapId.find('> .tab-cont').hide().eq(idx).show();
	btn.on('click', function(e){
		var targetLink = $(this).attr('href');
		$(this).closest('li').addClass('active').siblings('li').removeClass('active');
		tabWrapId.find('> .tab-cont').hide();
		$(targetLink).fadeIn();
		e.preventDefault();
	});
}

//selectbox
function select(){
    $('.select').each(function(){
        var txt = $(this).find('.txt');
        var $select = $(this).find('ul');
        txt.on('click', function(){
            if(!$select.is(':visible')){
                $('.select ul').hide();
                $select.slideDown();
            }else{
                $select.slideUp(150);
            }
        });
        $select.find('a').on('click', function(){
            var selTxt = $(this).text();
            txt.text(selTxt);
            $select.slideUp(150);
        });
    });
}

//accordian
function accordian(){
    $('.accordian').each(function(){
        var btn = $(this).find('dt a');
        btn.on('click', function(){
            var dt = $(this).closest('dt');
            var dd = dt.next('dd');
            if(dt.is('.on')){
                dt.removeClass('on');
                dd.slideUp(100);
            } else {
                dt.addClass('on');
                dd.slideDown(250);
            }
        });
    });
}

//layer popup open
function popupOpen(id){
	$(id).closest('.layer-wrap').show();
	var clientW = document.documentElement.clientWidth;
	var clientH = document.documentElement.clientHeight;
	var popupW = $(id).width();
	var popupH = $(id).height();
	
	$(id).css({
		'left' : (clientW-popupW)/2,
		'top' : (clientH-popupH)/2
	}).addClass('on');
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

//layer popup close
function popupClose(e){
    $(e).closest('.layer-popup').removeClass('on');
    $(e).closest('.layer-wrap:visible').hide();
}