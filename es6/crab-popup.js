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
            slice: [].slice
        };

        const data = {
            currentIndex: 0,
            currentImg: undefined,
            imgs: [],
            setImgs(imgs) {
                this.imgs = imgs;
            },
            setImg(index) {
                const maxIndex = this.imgs.length - 1;
                index < 0 && (index = maxIndex);
                index > maxIndex && (index = 0);

                this.currentImg = this.imgs[index];
                this.currentIndex = index;
            }
        };

        const ui = {
            init() {
                const style = document.getElementById('crab_popup_style') || utils.createEle('style', {
                    id: 'crab_popup_style',
                    innerText: ''
                }),
                    popupBox = this.box = document.getElementById('crab_popup_box') || utils.createEle('div', {
                        id: 'crab_popup_box',
                        innerHTML: '<span class="prev change"></span><div id="crab_popup_pane"></div><span class="crab_popup_close"></span><span class="next change"></span>'
                    });

                document.head.appendChild(style);
                document.body.appendChild(popupBox);
            },
            setImg() {
                const img = data.imgs[data.currentIndex],
                    box = document.getElementById('crab_popup_box'),
                    pane = document.getElementById('crab_popup_pane'),
                    new_Img = utils.createEle('img', {
                        src: img.src
                    });

                pane.innerHTML = '';
                pane.appendChild(new_Img);
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
                selector: 'img'
            },
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
                    close = box.querySelector('.crab_popup_close'),
                    prev = box.querySelector('.prev'),
                    next = box.querySelector('.next');

                this.root.forEach((r) => {
                    const imgs = utils.slice.call(r.querySelectorAll(this.opts.selector), 0);

                    imgs.forEach((img, i, imgs) => {
                        img.addEventListener('click', () => {
                            this.setImg(i, imgs);
                        })
                    })
                });

                prev.addEventListener('click', () => {
                    event.stopPropagation();
                    this.prev();
                });

                next.addEventListener('click', () => {
                    event.stopPropagation();
                    this.next();
                });

                close.addEventListener('click', () => {
                    event.stopPropagation();
                    ui.close();
                })

                box.addEventListener('click', () => {
                    ui.close();
                });
            },
            setImg(i, imgs) {
                data.setImgs(imgs);
                data.setImg(i);
                ui.setImg();
            },
            prev() {
                data.setImg(--data.currentIndex);
                ui.setImg();
            },
            next() {
                data.setImg(++data.currentIndex);
                ui.setImg();
            }
        };

        this.init = ctrl.init.bind(ctrl);

    }

    window.Popup = new Popup();
})(window, window.document);