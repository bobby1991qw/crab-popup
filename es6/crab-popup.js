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
            }
        };

        const data = {
            currentIndex: 0,
            currentImg: undefined,
            imgs: [],
            setImgs(imgs) {
                this.imgs = imgs;
            },
            showImg(index) {
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
                    popupBox = document.getElementById('crab_popup_box') || utils.createEle('div', {
                        id: 'crab_popup_box',
                        innerHTML: '<span class="prev"></span><div id="crab_popup_pane"></div><span class="crab_popup_close"></span><span class="next"></span>'
                    });

                document.head.appendChild(style);
                document.body.appendChild(popupBox);
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
                    ele = document.querySelector(ele);
                }

                this.root = [].concat(ele);
                ui.init();

            }
        };

        this.init = ctrl.init;

    }

    window.Popup = new Popup();
})(window, window.document);