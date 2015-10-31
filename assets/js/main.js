!(function(window, $) {
    var interval = 1,
        timer = new Timer('#seconds');
    $(function(){
        setInterval(function () {
            timer.countdown(interval);
        }, interval * 1000);
    });

    function Timer(selector) {
        this.subject = $(selector);
        this.break = 0;
    }

    Timer.prototype.countdown = function (interval) {
        var currentVal = parseInt(this.subject.html()),
            newVal = (currentVal - interval) > this.break ?
            currentVal - interval : this.break;
        if (newVal < 10) {
            newVal = '0' + newVal;
        }
        this.subject.html(newVal);
    }
}(window, window.jQuery));
