function initSearch() {

    $("#search").on("input", function() {
        searchMerchant($(this).val());
    });
}

function searchMerchant(query) {
    var trimQuery = query.trim().toLowerCase();
    var merchants = $('.merchant');
    merchants.each(index => {
        var merchant = merchants[index];
        let span = $(merchant).children('span');
        if (!span.text().toLowerCase().includes(trimQuery)) {
            $(merchant).addClass('hidden');
        } else {
            $(merchant).removeClass('hidden');
        }
    })
}

function goToPage(pageId) {
    console.log(pageId);
    const El = document.getElementById(pageId);
    El.scrollIntoView({ behavior: 'smooth', block: 'center'});
    // scrollToElm(document.getElementById("container"), El, 600);
}

function scrollToElm(container, elm, duration){
    var pos = getRelativePos(elm);
    console.log(pos);
    scrollTo( container, pos.top , 0.1);  // duration in seconds
}

function getRelativePos(elm){
    var pPos = elm.parentNode.getBoundingClientRect(), // parent pos
        cPos = elm.getBoundingClientRect(), // target pos
        pos = {};

    pos.top    = cPos.top    - pPos.top + elm.parentNode.scrollTop,
        pos.right  = cPos.right  - pPos.right,
        pos.bottom = cPos.bottom - pPos.bottom,
        pos.left   = cPos.left   - pPos.left;

    return pos;
}

function easeInOutQuad(t){ return t<.5 ? 2*t*t : -1+(4-2*t)*t };

function scrollTo(element, to, duration, onDone) {
    var start = element.scrollTop,
        change = to - start,
        startTime = performance.now(),
        val, now, elapsed, t;

    function animateScroll(){
        console.log('start');
        now = performance.now();
        elapsed = (now - startTime)/1000;
        t = (elapsed/duration);

        element.scrollTop = start + change * easeInOutQuad(t);

        if( t < 1 )
            window.requestAnimationFrame(animateScroll);
        else
            onDone && onDone();
    };

    animateScroll();
}

$.getJSON("merchant.json", function (data) {
    var scrollTabInner = $('.scroll_tab_inner');
    var tabContainer = $(scrollTabInner).children('span');
    var previous = tabContainer[0];
    var next = tabContainer[1];
    scrollTabInner.html(previous);

    var groupNames = data.groupNames;
    for (var k = 0; k < groupNames.length; k++) {
        var group = groupNames[k];
        scrollTabInner.append("<span onclick=\"goToPage('" + group + "')\" class='" + (k === 0 ? "tab_selected" : "") + "'>" + group + "</span>");
    }
    scrollTabInner.append(next);
    for (let k = 0; k < groupNames.length; k++) {
        var group = groupNames[k];
        $('#scrollable-container').append("<div class=\"merchant-group " + (k > 0 ? "mt-2" : "") + "\" id='" + group + "'>\n" +
            "        <div class=\"group-title\">" + group + "</div>\n" +
            "        <div class=\"group-content\">\n" + "<div id=\"m" + k + "\" class=\"row\">\n");
        let t = 0;
        for (let i = 0; i < data.merchants.length; i++) {
            var merchant = data.merchants[i];
            if (merchant.group === group) {
                t++;
                $('#m' + k).append(
                    "                <div class=\"col-3 merchant d-flex margin-top-15px flex-column align-items-center\">\n" +
                    "                    <img src=\"" + merchant.icon + "\" class=\"merchant-icon\">\n" +
                    "                    <span class=\"merchant-title mt-1\">" + merchant.name + "</span>\n" +
                    "                </div>\n" +
                    "            </div>\n" +
                    "        </div>\n" +
                    "    </div>"
                )
            }
        }
    }

    this.itemTag = 'span';

    $('.scroll_tab_inner span').click(function (e) {
        e.stopPropagation();
        $('.tab_selected').removeClass('tab_selected scroll_tab_first_selected scroll_tab_last_selected scroll_tab_left_finisher_selected scroll_tab_right_finisher_selected');
        $(this).addClass('tab_selected');

        var context_obj = this;
        if($(this).hasClass('scroll_tab_left_finisher')){
            context_obj = $('.scroll_tab_inner span.scroll_tab_first').addClass('tab_selected').addClass('scroll_tab_first_selected');
        }
        if($(this).hasClass('scroll_tab_right_finisher')){
            context_obj = $('.scroll_tab_inner span.scroll_tab_last').addClass('tab_selected').addClass('scroll_tab_last_selected');
        }
        if($(this).hasClass('scroll_tab_first') || $('.scroll_tab_inner > span.scroll_tab_last').hasClass('scroll_tab_first')){
            $('.scroll_tab_inner > span.scroll_tab_left_finisher').addClass('tab_selected').addClass('scroll_tab_left_finisher_selected');
        }
        if($(this).hasClass('scroll_tab_last') || $('.scroll_tab_inner span.scroll_tab_first').hasClass('scroll_tab_last')){
            $('.scroll_tab_inner > span.scroll_tab_right_finisher').addClass('tab_selected').addClass('scroll_tab_left_finisher_selected');
        }

    });

    $('.scroll_tab_inner span', this).mouseover(function(){
        $(this).addClass('scroll_tab_over');
        if($(this).hasClass('scroll_tab_left_finisher')){
            $('.scroll_tab_inner > '+_this.itemTag+'.scroll_tab_first', _this).addClass('scroll_tab_over').addClass('scroll_tab_first_over');
        }
        if($(this).hasClass('scroll_tab_right_finisher')){
            $('.scroll_tab_inner > '+_this.itemTag+'.scroll_tab_last', _this).addClass('scroll_tab_over').addClass('scroll_tab_last_over');
        }
        if($(this).hasClass('scroll_tab_first') || $('.scroll_tab_inner > '+_this.itemTag+'.scroll_tab_last', _this).hasClass('scroll_tab_first')){
            $('.scroll_tab_inner > span.scroll_tab_left_finisher', _this).addClass('scroll_tab_over').addClass('scroll_tab_left_finisher_over');
        }
        if($(this).hasClass('scroll_tab_last') || $('.scroll_tab_inner > '+_this.itemTag+'.scroll_tab_first', _this).hasClass('scroll_tab_last')){
            $('.scroll_tab_inner > span.scroll_tab_right_finisher', _this).addClass('scroll_tab_over').addClass('scroll_tab_right_finisher_over');
        }
    }).mouseout(function(){
        $(this).removeClass('scroll_tab_over');
        if($(this).hasClass('scroll_tab_left_finisher')){
            $('.scroll_tab_inner > '+_this.itemTag+'.scroll_tab_first', _this).removeClass('scroll_tab_over').removeClass('scroll_tab_first_over');
        }
        if($(this).hasClass('scroll_tab_right_finisher')){
            $('.scroll_tab_inner > '+_this.itemTag+'.scroll_tab_last', _this).removeClass('scroll_tab_over').removeClass('scroll_tab_last_over');
        }
        if($(this).hasClass('scroll_tab_first') || $('.scroll_tab_inner > '+_this.itemTag+'.scroll_tab_last', _this).hasClass('scroll_tab_first')){
            $('.scroll_tab_inner > span.scroll_tab_left_finisher', _this).removeClass('scroll_tab_over').removeClass('scroll_tab_left_finisher_over');
        }
        if($(this).hasClass('scroll_tab_last') || $('.scroll_tab_inner > '+_this.itemTag+'.scroll_tab_first', _this).hasClass('scroll_tab_last')){
            $('.scroll_tab_inner > span.scroll_tab_right_finisher', _this).removeClass('scroll_tab_over').removeClass('scroll_tab_right_finisher_over');
        }
    }).click(function(e){
        console.log('.scroll_tab_inner > '+this.itemTag+(this.itemTag !== 'span' ? ', .scroll_tab_inner > span' : ''));

        e.stopPropagation();
        $('.tab_selected',_this).removeClass('tab_selected scroll_tab_first_selected scroll_tab_last_selected scroll_tab_left_finisher_selected scroll_tab_right_finisher_selected');
        $(this).addClass('tab_selected');

        var context_obj = this;
        if($(this).hasClass('scroll_tab_left_finisher')){
            context_obj = $('.scroll_tab_inner > '+_this.itemTag+'.scroll_tab_first', _this).addClass('tab_selected').addClass('scroll_tab_first_selected');
        }
        if($(this).hasClass('scroll_tab_right_finisher')){
            context_obj = $('.scroll_tab_inner > '+_this.itemTag+'.scroll_tab_last', _this).addClass('tab_selected').addClass('scroll_tab_last_selected');
        }
        if($(this).hasClass('scroll_tab_first') || $('.scroll_tab_inner > '+_this.itemTag+'.scroll_tab_last', _this).hasClass('scroll_tab_first')){
            $('.scroll_tab_inner > span.scroll_tab_left_finisher', _this).addClass('tab_selected').addClass('scroll_tab_left_finisher_selected');
        }
        if($(this).hasClass('scroll_tab_last') || $('.scroll_tab_inner > '+_this.itemTag+'.scroll_tab_first', _this).hasClass('scroll_tab_last')){
            $('.scroll_tab_inner > span.scroll_tab_right_finisher', _this).addClass('tab_selected').addClass('scroll_tab_left_finisher_selected');
        }

        // "Slide" it into view if not fully visible.
        scroll_selected_into_view.call(_this, state);

        opts.click_callback.call(context_obj,e);
    });
});
