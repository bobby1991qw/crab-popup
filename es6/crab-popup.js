; (function (window, document, undefined) {
    function Popup() {
        const utils = {
            createEle(tagName, attrs) {
                const ele = document.createElement(tagName);

                for (const key in attrs) {
                    if (attrs.hasOwnProperty(key)) {
                        ele[key] = attrs[key];
                    }
                }

                return ele;
            },
            extends(dest, source) {
                const args = arguments;

                if (args.length > 2) {
                    return this.extends.apply(this, this.slice.call(args, 1));
                } else {
                    for (const key in source) {
                        if (source.hasOwnProperty(key)) {
                            dest[key] = source[key];
                        }
                    }

                    return dest;
                }
            },
            slice: [].slice,
            getAgent() {
                const mobilePattern = /mobile/i;

                return {
                    isMobile: mobilePattern.test(navigator.userAgent)
                }
            },
            calcDistance(p1, p2) {
                return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
            },
            addEvent(context, type, tag, callback) {
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
                    context.forEach((ctx) => {
                        ctx.addEventListener(type, () => {
                            const trueTag = event.srcElement,
                                tags = this.slice.call(ctx.querySelectorAll(tag), 0),
                                index = tags.indexOf(trueTag);

                            if (index > -1) {
                                callback.call(tags[index], index, tags);
                            }
                        })
                    });
                } else {
                    context.forEach((ctx) => {
                        ctx.addEventListener(type, callback);
                    });
                }

            }
        };

        const data = {
            currentIndex: 0,
            lastIndex: 0,
            currentImg: undefined,
            imgs: [],
            setImgs(imgs) {
                this.imgs = imgs;
            },
            setImg(index) {
                const maxIndex = this.imgs.length - 1;
                index < 0 && (index = maxIndex);
                index > maxIndex && (index = 0);

                this.lastIndex = this.currentImg;
                this.currentImg = this.imgs[index];
                this.currentIndex = index;
            }
        };

        const ui = {
            init() {
                const isMobile = ctrl.isMobile = utils.getAgent().isMobile,
                    style = document.getElementById('crab_popup_style') || utils.createEle('style', {
                        id: 'crab_popup_style',
                        innerText: ''
                    }),
                    innerHTML = isMobile ?
                        '<div id="crab_popup_pane"><div class="img_box"></div></div><span class="crab_popup_close"></span>' :
                        '<span class="prev change"></span><div id="crab_popup_pane"><div class="img_box"></div><div class="page_num"></div></div><span class="crab_popup_close"></span><span class="next change"></span>',
                    popupBox = this.box = document.getElementById('crab_popup_box') || utils.createEle('div', {
                        id: 'crab_popup_box',
                        className: isMobile ? 'mobile' : 'pc',
                        innerHTML: innerHTML
                    });

                document.head.appendChild(style);
                document.body.appendChild(popupBox);
            },
            currentImg: undefined,
            setImg() {
                const img = data.imgs[data.currentIndex],
                    box = document.getElementById('crab_popup_box'),
                    pane = document.getElementById('crab_popup_pane'),
                    img_box = pane.querySelector('.img_box'),
                    page_num = pane.querySelector('.page_num'),
                    new_Img = utils.createEle('img', {
                        onload: () => {
                            const img = event.target,
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
                ctrl.isMobile || (page_num.innerText = `${data.currentIndex + 1} / ${data.imgs.length}`);
                box.style.display = 'block';
                box.classList.add('show');
            },
            close() {
                const box = this.box;

                box.classList.remove('show');
                setTimeout(() => {
                    box.style.display = 'none';
                }, 250);
            }
        };

        const ctrl = {
            root: [],
            defaults: {
                selector: 'img',
                maskClosable: true
            },
            touch: { count: 0 },
            init(ele, opts) {
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
            bindEvent() {
                const box = document.getElementById('crab_popup_box'),
                    close = box.querySelector('.crab_popup_close');

                this.root.forEach((r) => {

                    utils.addEvent(r, 'click', this.opts.selector, ((i, imgs) => {
                        if (data.imgs.indexOf(imgs[i]) > -1) {
                            console.time('noMatch');                            
                            this.setImg(i);
                            console.timeEnd('noMatch');
                        } else {
                            console.time('match');    
                            const contexts = [].slice.call(r.querySelectorAll(this.opts.contextSelector), 0),
                                img = imgs[i];

                            for (let index = contexts.length - 1; index >= 0; index--) {
                                const realImgs = [].slice.call(contexts[index].querySelectorAll(this.opts.selector), 0);
                                if (realImgs.indexOf(img) > -1) {
                                    this.setImg(i, realImgs);
                                    break;
                                }
                            }

                            console.timeEnd('match');
                        }
                    }).bind(r));
                });

                if (!this.isMobile) {
                    const prev = box.querySelector('.prev'),
                        next = box.querySelector('.next');

                    utils.addEvent(prev, 'mouseover', () => {
                        prev.classList.add('show');
                        next.classList.add('show');
                    });


                    utils.addEvent(next, 'mouseover', () => {
                        prev.classList.add('show');
                        next.classList.add('show');
                    });

                    utils.addEvent(prev, 'mouseleave', () => {
                        prev.classList.remove('show');
                        next.classList.remove('show');
                    });

                    utils.addEvent(next, 'mouseleave', () => {
                        prev.classList.remove('show');
                        next.classList.remove('show');
                    });

                    utils.addEvent(prev, 'click', () => {
                        event.stopPropagation();
                        this.prev();
                    });

                    utils.addEvent(next, 'click', () => {
                        event.stopPropagation();
                        this.next();
                    });

                    if (this.opts.maskClosable) {
                        box.addEventListener('click', () => {
                            ui.close();
                        });
                    }
                } else {
                    const pane = box.querySelector('#crab_popup_pane'),
                        img = pane.querySelector('img');

                    utils.addEvent(pane, 'touchstart', 'img', () => {
                        const touch = event.touches[0],
                            touchData = this.touch;

                        ui.currentImg.style.transformOrigin = `${touch.clientX}px ${touch.clientY + 10}px`;

                        touchData.y = touch.clientY;
                    });

                    utils.addEvent(pane, 'touchstart', () => {
                        const touch = event.touches[0],
                            touchData = this.touch;

                        touchData.start = true;

                        touchData.x = touch.clientX;
                    });

                    utils.addEvent(pane, 'touchmove', 'img', () => {
                        const currentY = event.touches[0].clientY,
                            y = this.touch.y,
                            distance = Math.abs(currentY - y),
                            max = Math.sqrt(window.screen.height / 2);

                        if (Math.abs(distance) > 30) {
                            this.touch.start = false;
                            ui.currentImg.style.transform = `scale(${2 * Math.sqrt(distance) / max})`;
                        }
                    });

                    utils.addEvent(pane, 'touchend', () => {
                        const touchData = this.touch,
                            touch = event.changedTouches[0],
                            x = touch.clientX,
                            distance = x - touchData.x,
                            dir = distance > 0 ? 1 : -1,
                            cb = ({
                                '-1': ctrl.next.bind(ctrl),
                                '1': ctrl.prev.bind(ctrl)
                            })[dir];

                        if (touchData.start) {
                            Math.abs(distance) >= 50 && cb();
                            touchData.start = false;
                        } else {
                            ui.currentImg.style.transform = 'scale(1)';
                        }
                    });
                }

                utils.addEvent(close, 'click', () => {
                    event.stopPropagation();
                    ui.close();
                });
            },
            setImg(i, imgs = data.imgs) {
                data.setImgs(imgs);
                data.setImg(i);
                ui.setImg();
            },
            prev() {
                if (this.isMobile) {
                    ui.currentImg.style.transform = 'translateX(100%)';
                }
                data.setImg(--data.currentIndex);
                setTimeout(ui.setImg.bind(ui, true), 250);
                ui.setImg();
            },
            next() {
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