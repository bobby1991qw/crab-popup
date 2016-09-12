'use strict';

;(function (window, document, undefined) {
    function Popup() {
        var utils = {
            createEle: function createEle(tagName, attrs) {
                var ele = document.createElement(tagName);

                for (var key in attrs) {
                    if (attrs.hasOwnProperty(key)) {
                        ele[key] = attrs[key];
                    }
                }

                return ele;
            },
            extends: function _extends(dest, source) {
                var args = arguments;

                if (args.length > 2) {
                    return this.extends.apply(this, this.slice.call(args, 1));
                } else {
                    for (var key in source) {
                        if (source.hasOwnProperty(key)) {
                            dest[key] = source[key];
                        }
                    }

                    return dest;
                }
            },

            slice: [].slice,
            getAgent: function getAgent() {
                var mobilePattern = /mobile/i;

                return {
                    isMobile: mobilePattern.test(navigator.userAgent)
                };
            },
            calcDistance: function calcDistance(p1, p2) {
                return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
            },
            addEvent: function addEvent(context, type, tag, callback) {
                var _this = this;

                type = ctrl.isMobile ? {
                    'click': 'touchend'
                }[type] || type : type;

                if (!context) {
                    throw new Error('未找到需绑定事件的元素');
                }

                // 修正参数
                if (arguments.length === 3) {
                    callback = tag;
                }

                if (typeof context === 'string') {
                    context = utils.slice.call(document.querySelectorAll(context), 0);
                }

                context = [].concat(context);

                if (arguments.length > 3) {
                    context.forEach(function (ctx) {
                        ctx.addEventListener(type, function () {
                            var trueTag = event.srcElement,
                                tags = _this.slice.call(ctx.querySelectorAll(tag), 0),
                                index = tags.indexOf(trueTag);

                            if (index > -1) {
                                callback.call(tags[index], index, tags);
                            }
                        });
                    });
                } else {
                    context.forEach(function (ctx) {
                        ctx.addEventListener(type, callback);
                    });
                }
            }
        };

        var data = {
            currentIndex: 0,
            lastIndex: 0,
            currentImg: undefined,
            imgs: [],
            setImgs: function setImgs(imgs) {
                this.imgs = imgs;
            },
            setImg: function setImg(index) {
                var maxIndex = this.imgs.length - 1;
                index < 0 && (index = maxIndex);
                index > maxIndex && (index = 0);

                this.lastIndex = this.currentImg;
                this.currentImg = this.imgs[index];
                this.currentIndex = index;
            }
        };

        var ui = {
            init: function init() {
                var isMobile = ctrl.isMobile = utils.getAgent().isMobile,
                    style = document.getElementById('crab_popup_style') || utils.createEle('style', {
                    id: 'crab_popup_style',
                    innerText: ''
                }),
                    innerHTML = isMobile ? '<div id="crab_popup_pane"><div class="img_box"></div></div><span class="crab_popup_close"></span>' : '<span class="prev change"></span><div id="crab_popup_pane"><div class="img_box"></div><div class="page_num"></div></div><span class="crab_popup_close"></span><span class="next change"></span>',
                    popupBox = this.box = document.getElementById('crab_popup_box') || utils.createEle('div', {
                    id: 'crab_popup_box',
                    className: isMobile ? 'mobile' : 'pc',
                    innerHTML: innerHTML
                });

                document.head.appendChild(style);
                document.body.appendChild(popupBox);
            },

            currentImg: undefined,
            setImg: function setImg() {
                var img = data.imgs[data.currentIndex],
                    box = document.getElementById('crab_popup_box'),
                    pane = document.getElementById('crab_popup_pane'),
                    img_box = pane.querySelector('.img_box'),
                    page_num = pane.querySelector('.page_num'),
                    new_Img = utils.createEle('img', {
                    onload: function onload() {
                        var img = event.target,
                            style = window.getComputedStyle(img),
                            width = parseInt(style.width),
                            height = parseInt(style.height),
                            imgRatio = width / height,
                            scrollWidth = document.body.scrollWidth,
                            scrollHeight = document.body.scrollHeight,
                            screenRatio = scrollWidth / scrollHeight;

                        if (ctrl.isMobile) {
                            if (width >= height || imgRatio > screenRatio) {
                                img.style.width = scrollWidth + 'px';
                            } else {
                                img.style.height = scrollHeight + 'px';
                            }
                        }
                    },
                    src: img.src
                });

                img_box.innerHTML = '';
                img_box.appendChild(new_Img);
                this.currentImg = new_Img;
                ctrl.isMobile || (page_num.innerText = data.currentIndex + 1 + ' / ' + data.imgs.length);
                box.style.display = 'block';
                box.classList.add('show');
            },
            close: function close() {
                var box = this.box;

                box.classList.remove('show');
                setTimeout(function () {
                    box.style.display = 'none';
                }, 250);
            }
        };

        var ctrl = {
            root: [],
            defaults: {
                selector: 'img',
                maskClosable: true
            },
            touch: { count: 0 },
            init: function init(ele, opts) {
                if (!ele) {
                    throw new Error('未传入DOM节点');
                }

                if (ele.nodeType !== 1) {
                    ele = utils.slice.call(document.querySelectorAll(ele), 0);
                }

                this.root = [].concat(ele);
                this.opts = utils.extends({}, this.defaults, opts);
                ui.init();
                this.bindEvent();
            },
            bindEvent: function bindEvent() {
                var _this2 = this;

                var box = document.getElementById('crab_popup_box'),
                    close = box.querySelector('.crab_popup_close');

                this.root.forEach(function (r) {

                    utils.addEvent(r, 'click', _this2.opts.selector, function (i, imgs) {
                        if (data.imgs.indexOf(imgs[i]) > -1) {
                            console.time('noMatch');
                            _this2.setImg(i);
                            console.timeEnd('noMatch');
                        } else {
                            console.time('match');
                            var contexts = [].slice.call(r.querySelectorAll(_this2.opts.contextSelector), 0),
                                img = imgs[i];

                            for (var index = contexts.length - 1; index >= 0; index--) {
                                var realImgs = [].slice.call(contexts[index].querySelectorAll(_this2.opts.selector), 0);
                                if (realImgs.indexOf(img) > -1) {
                                    _this2.setImg(i, realImgs);
                                    break;
                                }
                            }

                            console.timeEnd('match');
                        }
                    }.bind(r));
                });

                if (!this.isMobile) {
                    (function () {
                        var prev = box.querySelector('.prev'),
                            next = box.querySelector('.next');

                        utils.addEvent(prev, 'mouseover', function () {
                            prev.classList.add('show');
                            next.classList.add('show');
                        });

                        utils.addEvent(next, 'mouseover', function () {
                            prev.classList.add('show');
                            next.classList.add('show');
                        });

                        utils.addEvent(prev, 'mouseleave', function () {
                            prev.classList.remove('show');
                            next.classList.remove('show');
                        });

                        utils.addEvent(next, 'mouseleave', function () {
                            prev.classList.remove('show');
                            next.classList.remove('show');
                        });

                        utils.addEvent(prev, 'click', function () {
                            event.stopPropagation();
                            _this2.prev();
                        });

                        utils.addEvent(next, 'click', function () {
                            event.stopPropagation();
                            _this2.next();
                        });

                        if (_this2.opts.maskClosable) {
                            box.addEventListener('click', function () {
                                ui.close();
                            });
                        }
                    })();
                } else {
                    var pane = box.querySelector('#crab_popup_pane'),
                        img = pane.querySelector('img');

                    utils.addEvent(pane, 'touchstart', 'img', function () {
                        var touch = event.touches[0],
                            touchData = _this2.touch;

                        ui.currentImg.style.transformOrigin = touch.clientX + 'px ' + (touch.clientY + 10) + 'px';

                        touchData.y = touch.clientY;
                    });

                    utils.addEvent(pane, 'touchstart', function () {
                        var touch = event.touches[0],
                            touchData = _this2.touch;

                        touchData.start = true;

                        touchData.x = touch.clientX;
                    });

                    utils.addEvent(pane, 'touchmove', 'img', function () {
                        var currentY = event.touches[0].clientY,
                            y = _this2.touch.y,
                            distance = Math.abs(currentY - y),
                            max = Math.sqrt(window.screen.height / 2);

                        if (Math.abs(distance) > 30) {
                            _this2.touch.start = false;
                            ui.currentImg.style.transform = 'scale(' + 2 * Math.sqrt(distance) / max + ')';
                        }
                    });

                    utils.addEvent(pane, 'touchend', function () {
                        var touchData = _this2.touch,
                            touch = event.changedTouches[0],
                            x = touch.clientX,
                            distance = x - touchData.x,
                            dir = distance > 0 ? 1 : -1,
                            cb = {
                            '-1': ctrl.next.bind(ctrl),
                            '1': ctrl.prev.bind(ctrl)
                        }[dir];

                        if (touchData.start) {
                            Math.abs(distance) >= 50 && cb();
                            touchData.start = false;
                        } else {
                            ui.currentImg.style.transform = 'scale(1)';
                        }
                    });
                }

                utils.addEvent(close, 'click', function () {
                    event.stopPropagation();
                    ui.close();
                });
            },
            setImg: function setImg(i) {
                var imgs = arguments.length <= 1 || arguments[1] === undefined ? data.imgs : arguments[1];

                data.setImgs(imgs);
                data.setImg(i);
                ui.setImg();
            },
            prev: function prev() {
                if (this.isMobile) {
                    ui.currentImg.style.transform = 'translateX(100%)';
                }
                data.setImg(--data.currentIndex);
                setTimeout(ui.setImg.bind(ui, true), 250);
                ui.setImg();
            },
            next: function next() {
                if (this.isMobile) {
                    ui.currentImg.style.transform = 'translateX(-100%)';
                }
                data.setImg(++data.currentIndex);
                ui.setImg();
            }
        };

        this.init = ctrl.init.bind(ctrl);
    }

    window.Popup = new Popup();
})(window, window.document);