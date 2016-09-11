Popup.init('body', {
    selector: 'img',
    maskClosable: false,
    contextSelector: '.imgs'
});

var imgs = document.createElement('div');
imgs.className = "imgs";
imgs.innerHTML = '<img class="qw" src="http://7xqekd.com1.z0.glb.clouddn.com/57a31a18fe7aaace4bba91d2/1473219055.jpg" alt=""><img src="http://7xqekd.com1.z0.glb.clouddn.com/57c459f7431786b906191351/1473217770.jpg" alt=""><img class="qw" src="http://img.vmeixi.com/uploads/2012/08/2012081501.jpg" alt="">';

document.body.appendChild(imgs);