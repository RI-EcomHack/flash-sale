!(function(window, $) {
    var interval = 1,
        flipRateOn = 60,
        flipRateWait = 30,
        lang = 'en',
        resource = 'http://5.196.27.161:8080/flash_sale',
        timer;

    $(function(){
        timer = new Timer('#seconds', '#wait');
        setInterval(function () {
            timer.countdown(interval);
        }, interval * 1000);

    });

    function Product(data, lang) {
        var price = data.masterVariant.prices[0].value;
        this.title = data.name[lang];
        this.description = data.description[lang];
        this.image = data.masterVariant.images[0].url;
        this.price = price.centAmount / 100 + " " + price.currencyCode;
    }

    Product.prototype.display = function () {
        $('.title').html(this.title);
        $('.description').html(this.description);
        $('.price').html(this.price);
        $('.image img').attr('src', this.image);

        return this;
    };

    function Timer(countdownSelector, waitSelector) {
        this.countdownElem = $(countdownSelector);
        this.waiterElem = $(waitSelector);
        this.breakPoint = 0;
        this.currentPause = flipRateWait * 2;
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
            var newWaitVal = this.currentPause;
            if (this.currentPause < 10) {
                newWaitVal = '0' + this.currentPause;
                $(".waitContainer").addClass('blink').addClass('big');
            }

            this.waiterElem.html(newWaitVal);
        } else if($("#flashSale").hasClass('out')) {
            this.flip(true);
        }
    };

    Timer.prototype.flip = function(isOn) {
        if (isOn) {
            this.currentVal = flipRateOn;


        } else {
            this.currentPause = flipRateWait;
            $(".waitContainer").show();

        }

        if($('#flashSale').hasClass('out')) {
            $.get(resource, function (dataSet) {
                var data = JSON.parse(dataSet),
                    product = new Product(data.results[0], lang).display();
            });
            $(".waitContainer").removeClass('big')
                .removeClass('blink').delay(100).queue(function(next) {
                    $(this).addClass('out');
                    $(this).hide();
                    next();
                });
            $('#flashSale').show().delay(100).queue(function(next) {
               $(this).removeClass('out');
                next()
            });
        } else {
            $('#flashSale').hide().addClass('out');
            $(".waitContainer").show().delay(100).queue(function(next) {
                $(this).addClass('big').removeClass('out');
                next()
            });
        }
    };
}(window, window.jQuery));
