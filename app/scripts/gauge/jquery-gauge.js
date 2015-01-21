define(['jquery', 'gauge'], function ($, Gauge) {

    (function ($) {

        $.fn['gauge'] = function (options) {
            this.each(function () {
                if (!$.data(this, 'gauge')) {
                    $.data(this, 'gauge', new Gauge(this, options));
                }
            });

            return this;
        };

    })(jQuery);

    return jQuery;

});