'use strict';
$(function () {

    var ScreenWidth = $(window).width(),
        ScreenHeight = $(window).height();

    //обработка тачей
    if (isTouch()) {
        $('html').addClass('touch');
    }
    else{
        $('html').addClass('no-touch');
    }
    function isTouch() {
        try {
            document.createEvent("TouchEvent");
            return true;
        }
        catch (e) {
            return false;
        }
    }

    //btn-menu header
    $(".j-menu").on('click', function(e) {
        var sec = 200,
            btn = $(this).children(),
            ul = $(this).siblings('ul'),
            li = ul.children('li');

            ul.outerHeight(ScreenHeight).slideToggle(500);
        if(btn.hasClass('active')){
            btn.removeClass('active');
            li.each(function() {
                $(this).animate({'left':'-100%'}, sec);
                sec += 200;
            });
            sec = 200;
        }
        else{
            btn.addClass('active');
            li.each(function() {
                $(this).animate({'left':'0'}, sec);
                sec += 100;
            });
            sec = 200;
        }
    });

    //вставка addBlock в конец appendBlock
    function appendBlock(addBlock, appendBlock){
        $(addBlock).appendTo(appendBlock);
    }

    //вставка addBlock в начало prependBlock
    function beforeBlock(addBlock, beforeBlock){
        $(addBlock).insertBefore(beforeBlock);
    }


    //делаем паралакс в хедере
    function parallax(parallaxClass) {
        $(window).on('scroll', function () {
            var scroll = $(this).scrollTop();
            parallaxClass.css({'transform' : 'translateY('+ -scroll/2+'px)'});
        });
    }
    //parallax($('.j-parallax__header'));

    //делаем паралакс в .demonstration
    function parallaxDemonstration(parallaxClass) {
        $(window).on('scroll', function () {
            var scroll = $(this).scrollTop() + 100;
            if($(this).scrollTop() > $(parallaxClass).offset().top){
                scroll -= $(parallaxClass).offset().top - 100;
                parallaxClass.css({'background-position' : '30px '+scroll/2+'%'});
            }
        });
    }

    //добавляем класс при скролле в верхний хедер
    function fixedHeader(){
        var fixedEl = $('.j-header-top');
        $(window).on('scroll', function () {
            if($(this).scrollTop() > 0){
                fixedEl.addClass('scroll-top');
            }
            else{
                fixedEl.removeClass('scroll-top');
            }
        });
        if($('body').scrollTop() > 0){
            fixedEl.addClass('scroll-top');
        }
        else{
            fixedEl.removeClass('scroll-top');
        }
    }
    fixedHeader();

    function addIconMenu(menuClass){
        menuClass.children('li').each(function(index){
            $(this).prepend('<i class="icon icon-ok"/>')
        });
    }
    addIconMenu($('.j-list-ok'));

    function autoColumn(columns, className, minColumn){
        $('.j-columns').autocolumnlist({
            columns: columns,
            classname: className,
            min: minColumn
        });
    }

    if(ScreenWidth > 992){
        autoColumn(3,'g-column-item',2);
        parallaxDemonstration($('.j-parallax-demonstration'));
    }
    if(ScreenWidth < 992){
        autoColumn(2,'g-column-item',2);
    }
    if(ScreenWidth < 768){
        appendBlock('.j-footer-block','.b-footer-top');
        beforeBlock('.j-review-img','.b-review-info');
    }
});

//preloader
$(window).on('load',function() {
    $(".j-loader-inner").fadeOut();
    $(".j-loader").delay(500).fadeOut("slow");
    $('body').delay(500).css({'overflow':'visible'});
    $(".j-loader span").delay(500).animate({'width': 0},500);
});