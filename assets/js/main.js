!(function(window, $) {
    var interval = 1,
        flipRate = 10,
        lang = 'en',
        resource = 'http://5.196.27.161:8080/flash_sale',
        timer;

    $(function(){
        $.get(resource, function (data) {
            timer = new Timer('#seconds', '#wait', data);
            setInterval(function () {
                timer.countdown(interval);
            }, interval * 1000);
        });
    });

    function Timer(countdownSelector, waitSelector, dataSet) {
        this.countdownElem = $(countdownSelector);
        this.waiterElem = $(waitSelector);
        this.dataSet = JSON.parse(dataSet);
        this.breakPoint = 0;
        this.currentPause = flipRate;
        this.currentVal = 0;
        this.countdownElem.html(this.currentVal);
        this.waiterElem.html(this.currentPause);
    }

    Timer.prototype.countdown = function (interval) {
        var newVal = this.currentVal;
        if (this.currentVal > this.breakPoint) {
             this.currentVal -= interval;
            if (this.currentVal < 10) {
                newVal = '0' + this.currentVal;
            }
            this.countdownElem.html(newVal);

            if (this.currentVal === 0) {
                this.flip();
            }
        } else if (!$("#flashSale").hasClass('out')) {
            this.flip();
        }

        if (this.currentPause > this.breakPoint) {
            this.currentPause -= interval;
            this.waiterElem.html(this.currentPause);
        } else if($("#flashSale").hasClass('out')) {
            this.flip(true);
        }
    };

    Timer.prototype.flip = function(isOn) {
        if (isOn) {
            this.currentVal = flipRate;


        } else {
            this.currentPause = flipRate;
            $(".waitContainer").show();

        }

        if($('#flashSale').hasClass('out')) {
            $(".waitContainer").hide().addClass('out');
            $('#flashSale').show().delay(100).queue(function(next) {
               $(this).removeClass('out');
                next()
            });
        } else {
            $('#flashSale').hide().addClass('out');
            $(".waitContainer").show().delay(100).queue(function(next) {
                $(this).removeClass('out');
                next()
            });
        }
    };
}(window, window.jQuery));
