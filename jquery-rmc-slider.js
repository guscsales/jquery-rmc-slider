/*!
 * jQuery RMC Slider (Beta Version)
 * Original author: Gustavo Sales (https://github.com/hebsix)
 * Version: 0.5
 * 
 * Aditional Plugins:
 *      Required if using jQuery Animation: jQuery Easing (By gdsmith, https://github.com/gdsmith/jquery.easing, thanks :D)
 * 
 * Logs:
 *      0.1: The build with basic resources
 *      0.2: Fixed the transitions performance
 *      0.3: Fixed layers' bugs on change slide
 *      0.4: Fixed jQuery Animations
 *      0.5: Fixed mobile settings
 */

; (function ($, window, document, undefined) {

    var pluginName = 'rmcSlider',
        cssMotors = ['', '-webkit-', '-moz-', '-o-', '-ms-'],
        timing = //  By matthewlein (https://github.com/matthewlein/Ceaser), thanks :D
        {
            'linear': 'linear',
            'ease': 'ease',
            'easeIn': 'ease-in',
            'easeOut': 'ease-out',
            'easeInOut': 'ease-in-out',
            'easeInCubic': 'cubic-bezier(.55,.055,.675,.19)',
            'easeOutCubic': 'cubic-bezier(.215,.61,.355,1)',
            'easeInOutCubic': 'cubic-bezier(.645,.045,.355,1)',
            'easeInCirc': 'cubic-bezier(.6,.04,.98,.335)',
            'easeOutCirc': 'cubic-bezier(.075,.82,.165,1)',
            'easeInOutCirc': 'cubic-bezier(.785,.135,.15,.86)',
            'easeInExpo': 'cubic-bezier(.95,.05,.795,.035)',
            'easeOutExpo': 'cubic-bezier(.19,1,.22,1)',
            'easeInOutExpo': 'cubic-bezier(1,0,0,1)',
            'easeInQuad': 'cubic-bezier(.55,.085,.68,.53)',
            'easeOutQuad': 'cubic-bezier(.25,.46,.45,.94)',
            'easeInOutQuad': 'cubic-bezier(.455,.03,.515,.955)',
            'easeInQuart': 'cubic-bezier(.895,.03,.685,.22)',
            'easeOutQuart': 'cubic-bezier(.165,.84,.44,1)',
            'easeInOutQuart': 'cubic-bezier(.77,0,.175,1)',
            'easeInQuint': 'cubic-bezier(.755,.05,.855,.06)',
            'easeOutQuint': 'cubic-bezier(.23,1,.32,1)',
            'easeInOutQuint': 'cubic-bezier(.86,0,.07,1)',
            'easeInSine': 'cubic-bezier(.47,0,.745,.715)',
            'easeOutSine': 'cubic-bezier(.39,.575,.565,1)',
            'easeInOutSine': 'cubic-bezier(.445,.05,.55,.95)',
            'easeInBack': 'cubic-bezier(.6,-.28,.735,.045)',
            'easeOutBack': 'cubic-bezier(.175, .885,.32,1.275)',
            'easeInOutBack': 'cubic-bezier(.68,-.55,.265,1.55)'
        },
        defaults = {
            width: 1132,
            height: 558,
            fullwidth: false,
            prefix: 'rmc',
            speed: 500,
            dots: null,
            startIndex: 0,
            autoplay: 7000,
            easing: 'easeInCubic',
            cssTransitions: true
        };

    function Plugin(element, options) {
        this.element = element;

        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.initStructure = $(this.element).html();

        this.class = {
            slides: '.' + this.options.prefix + '-slides',
            slide: '.' + this.options.prefix + '-slide',
            bg: '.' + this.options.prefix + '-bg',
            layer: '.' + this.options.prefix + '-layer',
            dots: '.' + this.options.prefix + '-dots',
            dot: '.' + this.options.prefix + '-dot',
            container: '.' + this.options.prefix + '-container'
        };

        if (navigator.userAgent.toLowerCase().indexOf('msie 9.0') != -1)
            this.options.cssTransitions = false;

        this.interval = null;

        if (this.options.cssTransitions)
            this.options.easing = timing[this.options.easing];

        this.init();
        this.events();
    }

    Plugin.prototype = {

        init: function () {
            var self = this,
                $startSlide = $(this.element).find(this.class.slide).eq(this.options.startIndex);

            this.renderSlider();

            if (this.hasDots())
                this.renderDots();

            this.animateLayers($startSlide);
            this.autoPlay();


        },

        events: function () {
            var self = this;

            $(window).resize(function () {
                self.options.startIndex = self.currentIndex();

                self.destroy();
                self.init();
            });

            //$(window).resize(function () {
            //    var $e = $(self.element);

            //    $e.find(self.class.layer).css(self.removeTransition());
            //    $e.find(self.class.slide).css(self.removeTransition());

            //    self.renderSlides();
            //    self.renderLayers();
            //    self.animateLayers($e.find(self.class.slide).eq(self.currentIndex()));
            //});
        },

        /************************************
          Create
        ***********************************/
        renderSlider: function () {
            var $e = $(this.element),
                props = {
                    overflow: 'hidden'
                };

            if (this.options.fullwidth) {
                props.width = '100%';
            } else
                props.width = this.options.width;
            
            if (!this.isMobile('480'))
                props.height = this.options.height;
            else
                props.height = this.options.height - (this.options.height * 0.25);

            $e.css(props);

            this.renderSlides();
        },

        renderSlides: function () {
            var $e = $(this.element),
                $slides = $e.find(this.class.slide),
                width = this.fullwidthValue(),
                windowWdt = $(window).width(),
                container = { width: this.options.width, height: this.options.height };

            if (this.options.width > windowWdt)
                container.width = windowWdt - 30;

            var sliderStyle = { width: '100%', overflow: 'hidden' },
                containerStyle = { //  Fixed container on center
                    width: container.width,
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    marginLeft: -(container.width / 2)
                };

            if (!this.isMobile('480')) {
                sliderStyle.height = container.height;
                containerStyle.height = container.height;
            } else {
                sliderStyle.height = container.height - (container.height * 0.25);
                containerStyle.height = container.height - (container.height * 0.25);
            }

            $slides.css(sliderStyle)
                   .wrapAll('<div class="' + this.class.slides.replace('.', '') + '"></div>')
                   .find(this.class.container).css(containerStyle);

            for (var i = 0; i < $slides.length; i++) {
                var $slide = $slides.eq(i),
                    $bg = $slide.find(this.class.bg);

                if (this.options.cssTransitions)
                    $slide.css(this.transform('translate', { x: $slide.width() * (i - this.options.startIndex) }));
                else
                    $slide.css(this.position($slide.width() * (i - this.options.startIndex)));

                if ($bg.length > 0) {
                    var src = $bg.data('src');

                    if (this.isMobile('320'))
                        src = $bg.data('320-src');
                    else if (this.isMobile('480'))
                        src = $bg.data('480-src');
                    else if (this.isMobile('768'))
                        src = $bg.data('768-src');
                    else if (this.isMobile('1024'))
                        src = $bg.data('1024-src');

                    $bg.attr('src', src);
                }

            }

            $slides.eq(this.options.startIndex).addClass('current');
            
            this.renderLayers();
        },

        renderLayers: function () {
            var $layers = $(this.element).find(this.class.layer);

            for (var i = 0; i < $layers.length; i++) {
                var $layer = $layers.eq(i),
                    matrixDefault = 'matrix(1, 0, 0, 1, 0, 0)',
                    currentTransform = $layer.css('transform'),
                    pos = $layer.position(),
                    positionData = $layer.data('position');
                
                if (positionData != undefined) {
                    var pos = positionData['1200'];

                    if (this.isMobile('320'))
                        pos = positionData['320'];
                    else if (this.isMobile('480'))
                        pos = positionData['480'];
                    else if (this.isMobile('768'))
                        pos = positionData['768'];
                    else if (this.isMobile('1024'))
                        pos = positionData['1024'];

                    $layer.css({ top: pos[0], left: pos[1] });
                }

                $layer.css({ opacity: 0 });

                if (currentTransform != matrixDefault) {
                    $layer.css(this.removeTransition()).css('transform', 'matrix(1, 0, 0, 1, 0, 0)');

                    pos = $layer.position();

                    $layer.css('transform', currentTransform);
                    $layer.css(this.addTransition());
                } else
                    pos = $layer.position();

                console.log($layer.css('top'), $layer[0]);
                $layer.data('left', pos.left)
                      .data('top', pos.top);
            }
        },

        renderDots: function () {
            var self = this;

            $(this.element).append('<div class="' + this.class.dots.replace('.', '') + '"></div>');

            var $dots = $(this.element).find(this.class.dots);

            for (var i = 0; i < this.count() ; i++)
                $dots.append('<div class="' + this.class.dot.replace('.', '') + (i == this.options.startIndex ? ' active' : '') + '"></div>');

            $(this.element).find(this.class.dot).on('click', function () {
                self.goTo($(this).index());
            });
        },

        /************************************
          Methods
        ***********************************/
        currentIndex: function () {
            return $(this.element).find(this.class.slide + '.current').index();
        },

        count: function () {
            return $(this.element).find(this.class.slide).length;
        },

        hasDots: function () {
            return this.options.dots != null;
        },

        fullwidthValue: function () {
            return $(this.element).outerWidth(true);
        },

        goTo: function (index) {
            this.callback();

            var self = this,
                $e = $(this.element),
                $slides = $e.find(this.class.slide);

            if (this.options.cssTransitions)
                $slides.css(this.addTransition());

            for (var i = 0; i < this.count() ; i++) {
                var $slide = $slides.eq(i),
                    x = $slide.width() * (i - index);

                $slide.removeClass('current');

                if (this.options.cssTransitions) {
                    if (x == 0)
                        $slide.addClass('current');

                    $slide.css(this.transform('translate', { x: x }));
                }
                else {
                    if (x == 0)
                        $slide.stop().animate({ left: x }, this.options.speed, this.options.easing, function () {
                            var $this = $(this);

                            $this.addClass('current');

                            self.prepareSlideTransition($this);
                        });
                    else
                        $slide.stop().animate({ left: x }, this.options.speed, this.options.easing);
                }
            }

            if (this.hasDots())
                $e.find(this.class.dot).eq(index).addClass('active').siblings().removeClass('active');

            this.autoPlay();
        },

        next: function () {
            var index = this.currentIndex() + 1;

            if (index == this.count())
                index = 0;

            this.goTo(index);
        },

        prev: function () {
            var index = this.currentIndex() - 1;

            if (index == -1)
                index = this.count() - 1;

            this.goTo(index);
        },

        destroy: function () {
            $(this.element).html(this.initStructure).removeAttr('style');
        },

        autoPlay: function () {
            if (this.options.autoplay) {
                var self = this;

                clearInterval(this.interval);

                this.interval = setTimeout(function () {
                    self.next()
                }, this.options.autoplay);
            }
        },

        callback: function () {
            var self = this,
                $slides = $(this.element).find(this.class.slide);

            $slides.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function (e) {
                var $this = $(this);

                self.prepareSlideTransition($this);
                $this.unbind();
            });

        },

        prepareSlideTransition: function ($slide) {
            var $slides = $(this.element).find(this.class.slide),
                index = $slide.index(),
                currentIndex = this.currentIndex();

            if (index == currentIndex) {
                $slides.find(this.class.layer).css(this.removeTransition()).css({ opacity: 0 });

                this.animateLayers($slide);
            }
        },

        /************************************
          Animate layers
        ***********************************/
        animateLayers: function ($slide) {
            var self = this;

            setTimeout(function () {
                var $layers = $slide.find(self.class.layer),
                    originalPos = [];

                if (self.options.cssTransitions)
                    $layers.css(self.removeTransition());

                $layers.css({ opacity: 0 });

                for (var i = 0; i < $layers.length; i++) {

                    var $layer = $layers.eq(i),
                        effect = $layer.data('effect') || 'fade()';


                    if ($layer.data('valign-center')) {
                        var top = $layer.data('top') - ($layer.outerHeight(true) / 2);

                        $layer.css({ top: top });

                        originalPos.push({ left: $layer.data('left'), top: top });
                    } else
                        originalPos.push({ left: $layer.data('left'), top: $layer.data('top') });

                    if (self.options.cssTransitions) {
                        switch (effect.split('(')[0]) {
                            case 'left':
                            case 'right':
                                $layer.css({ left: eval(effect) });
                                break;
                            case 'top':
                            case 'bottom':
                                $layer.css({ top: eval(effect) });
                                break;
                            case 'scale':
                                $layer.css(self.transform('scale', eval(effect)));
                                break;
                        }
                    } else {
                        switch (effect.split('(')[0]) {
                            case 'left':
                            case 'right':
                                $layer.css({ left: eval(effect) });
                                break;
                            case 'top':
                            case 'bottom':
                                $layer.css({ top: eval(effect) });
                                break;
                            case 'scale':
                                $layer.css({ zoom: eval(effect) });
                                break;
                        }
                    }
                }

                setTimeout(function () {
                    for (var i = 0; i < $layers.length; i++) {
                        var $layer = $layers.eq(i),
                            effect = $layer.data('effect') || 'fade()',
                            duration = $layer.data('duration') || 800,
                            delay = $layer.data('delay') || 0,
                            easing = $layer.data('ease') || 'easeOutQuad';

                        if (self.options.cssTransitions) { //  With CSS
                            easing = timing[easing];

                            $layer.css(self.addTransition('all', duration, easing, delay))
                                  .css({ opacity: 1 });

                            switch (effect.split('(')[0]) {
                                case 'left':
                                case 'right':
                                    $layer.css({ left: originalPos[i].left });
                                    break;
                                case 'top':
                                case 'bottom':
                                    $layer.css({ top: originalPos[i].top });
                                    break;
                                case 'scale':
                                    $layer.css(self.transform('scale', { value: 1 }));
                                    break;
                            }
                        } else {
                            switch (effect.split('(')[0]) {
                                case 'left':
                                case 'right':
                                    $layer.delay(delay).animate({ opacity: 1, left: originalPos[i].left }, duration, easing);
                                    break;
                                case 'top':
                                case 'bottom':
                                    $layer.delay(delay).animate({ opacity: 1, top: originalPos[i].top }, duration, easing);
                                    break;
                                case 'scale':
                                    $layer.delay(delay).animate({ opacity: 1, zoom: '100%' }, duration, easing);
                                    break;
                            }
                        }

                    }
                });


                function left(distance) {
                    return $layer.position().left - distance;
                }

                function right(distance) {
                    return $layer.position().left + distance;
                }

                function top(distance) {
                    return $layer.position().top - distance;
                }

                function bottom(distance) {
                    return $layer.position().top + distance;
                }

                function scale(value) {
                    if (self.options.cssTransitions)
                        return { value: value };

                    return value * 100 + '%';
                }


                //  TODO: Add more effects
            }, 300);
        },

        /************************************
          Methods for animation
        ***********************************/
        transform: function (property, opts, $obj) {
            var cssLine = '';

            if ($obj != undefined && $obj.css('transform') != 'none')
                cssLine += $obj.css('transform');

            switch (property) {
                case 'translate':
                    if ($obj == undefined) {
                        if (opts.x == undefined)
                            opts.x == 0;

                        if (opts.y == undefined)
                            opts.y = 0;
                    } else {
                        var pos = $obj.position();

                        if (opts.x == undefined)
                            opts.x = pos.left;

                        if (opts.y == undefined)
                            opts.y = pos.top;
                    }

                    cssLine += ' translate(#x#px, #y#px)'.replace('#x#', opts.x).replace('#y#', opts.y);

                    break;
                case 'perspective':
                    cssLine += ' perspective(#value#px)'.replace('#value#', opts.value);
                    break;
                case 'scale':
                    cssLine += ' scale(#value#)'.replace('#value#', opts.value);
                    break;
            };

            if (cssLine != '') {
                return this.applyCssMotors('transform', cssLine);
            }
        },

        position: function (x, y) {
            if (y == undefined)
                y = 0;

            return { left: x, top: y };
        },

        addTransition: function (property, duration, easing, delay) {
            if (property == undefined)
                property = 'all';

            if (duration == undefined)
                duration = this.options.speed;

            if (easing == undefined)
                easing = this.options.easing;

            if (delay == undefined)
                delay = 0;

            return this.applyCssMotors('transition', '#property# #duration#ms #easing#  #delay#ms'
                                                        .replace('#property#', property)
                                                        .replace('#duration#', duration)
                                                        .replace('#easing#', easing)
                                                        .replace('#delay#', delay));
        },

        removeTransition: function () {
            return this.applyCssMotors('transition', 'none');
        },

        applyCssMotors: function (property, value) {
            var css = {};

            for (var i = 0; i < cssMotors.length; i++)
                css[cssMotors[i] + property] = value;

            return css;
        },

        /************************************
          Mobile Functions
        ***********************************/
        isMobile: function (resolution) {
            var windowWdt = $(window).width(),
                resolutions = { '320': 480, '480': 768, '768': 1024, '1024': 1200 },
                userAgentContains = /iPhone|iPad|Android|Windows Phone|Nokia|BB/.test(navigator.userAgent);



            if (resolution != undefined)
                return windowWdt < resolutions[resolution] && userAgentContains;

            return userAgentContains;
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);