/*

 Usage:
 -----

 $("#table").banke()


 Other methods:

 turn on sticky header
 $("#table").banke("headeroff");

 turn off sticky header
 $("#table").banke("headeron");


 turn on cross hair
 $("#table").banke("crosshairon");


 turn off cross hair
 $("#table").banke("crosshairoff");


 update throttle time (ms) for sticky header
 $("#table").banke("throttle", 50);

 These options are only available when first instantiate the object

 add classes to clone table
 $("#table").banke("classnames","class1 class2 class3");

 add attributes to clone table
 $("#table").banke("attributes","data-something='abc' data-something-else='def'");



 */
;(function ($,window) {

    $.fn.banke = function(opts,val) {
        return this.each(function(){
            var inst = $(this).data("banke");

            opts = opts || '';

            if (!inst) {
                inst = new Banke(this, opts,val);
                $(this).data("banke", inst);
            }



            switch (opts.toLowerCase()) {
                case 'crosshairon' : inst.onCrosshair();
                    break;
                case 'crosshairoff' : inst.offCrosshair();
                    break;
                case 'headeron' : inst.onStickyHeader();
                    break;
                case 'headeroff' : inst.offStickyHeader();
                    break;
                case 'refreshheader' : inst.refreshStickyHeader();
                    break;
                case 'throttle' : inst.updateThrottle(val);
                    break;
            }

            //return inst;
        });
    } // banke()



    // By Remy Sharp http://remysharp.com/2010/07/21/throttling-function-calls/
    function throttle(fn, delay) {
        var timer = null;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    }




    function Banke(table, opts, val) {
        // default parameters
        var o = {
                // add classnames to cloned header
                classnames : '',
                // add attributes cloned header
                attributes: '',
                // throttle browser scrolling execution
                throttle: 50
            },
            cloneId = "banke" + Math.floor(Math.random() * 100000),
            cloneTable,
            obj = {},
            isCloneTableVisible = false,
            $window = $(window)
            ;


        table = $(table);
        table.attr('data-banke-cloneid', cloneId);

        // validate requirements
        if (!table.find("thead").length) {
            throw new Error('banke: <thead> is required');
        }

        switch (opts) {
            case 'throttle' : o.throttle = val;
                break;
            case 'attributes' :o.attributes = val;
                break;
            case 'classnames' :o.classnames = val;
                break;
        }

        cloneTable =  $('<table id="' + cloneId + '" class="banke-clone ' + o.classnames + '"' + o.attributes + ' ></table>');

        // ref table thead, clone it to cloneTable
        table.thead = table.find('thead');
        cloneTable.thead = table.thead.clone();
        cloneTable.prepend(cloneTable.thead);

        cloneTable.hide().insertBefore(table);

        function crosshair(ev){
            var index = this.cellIndex,
                col = table.find("col").eq(index);

            if (ev.type === 'mouseenter') {
                col.addClass('hover');
            } else {
                col.removeClass('hover');
            }
        }

        obj.updateThrottle = function(val) {
            o.throttle = val;
        }

        obj.onCrosshair = function() {
            table.find("col").removeClass('hover');
            table.removeClass('crosshairOff').addClass('crosshairOn');
            table.on('mouseenter mouseleave', "td", crosshair);
            return this;
        } // onCrosshair

        obj.offCrosshair = function() {
            table.removeClass('crosshairOn').addClass('crosshairOff');
            table.off('mouseenter mouseleave', "td", crosshair);
            return this;
        } // offCrosshair()


        obj.refreshStickyHeader = function() {

            // clone the header
            var cloneThs = cloneTable.find("th");

            table.thead.find('th').each(function(i){
                var cell = $(this),
                    cloneTh = $(cloneThs[i]);

                cloneTh.width( cell.width());
                cloneTh.outerWidth( cell.outerWidth());
                cloneTh.height(cell.height());
            });

            cloneTable.width(table.width());

            //determine position

            table.pos = {
                start : table.offset().top + table.thead.height(),
                stop: table.offset().top + table.height()
            }

            // correct start pos, sometimes it happens, so can't calculate the offset
            if (isNaN(table.pos.start)) {
                table.pos.start = parseFloat(table.css("marginTop")) + table.thead.height();
            }
        }

        // determine whether to show/hide clone header
        var  toggleHeader = function(){
            console.log('toggleHeader');
            var currentY = $window.scrollTop() + table.thead.height();

            if (currentY >= table.pos.start && currentY <= table.pos.stop){
                if (!isCloneTableVisible) {
                    isCloneTableVisible = true;
                    table.thead.css('visibility','hidden');
                    cloneTable.show();
                }
            } else if (isCloneTableVisible) {
                isCloneTableVisible = false;
                cloneTable.hide();
                table.thead.css('visibility','visible');
            }
        }

        obj.onStickyHeader = function() {
            obj.refreshStickyHeader();
            $window.bind('scroll.banke', throttle(toggleHeader, o.throttle));
            $window.scroll();
            //    return this;
        }

        obj.offStickyHeader = function() {
            $window.unbind('scroll.banke');
            table.thead.css('visibility','visible');
            isCloneTableVisible = false;
            cloneTable.hide();
            // return this;
        }


        obj.onStickyHeader();
        obj.onCrosshair();

        return obj;
    }

})(jQuery, window);