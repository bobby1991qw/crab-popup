#crab-popup
***
*a img popup plugin*

##特性

1. 支持chrome,firefox,edge,ie10+
2. 支持移动端滑屏，支持移动端放大

##查看Demo

查看[在线demo](https://bobby1991qw.github.io/crab-popup/)演示或者

1. **下载此项目[zip文件](https://github.com/bobby1991qw/crab-popup/archive/master.zip)或者克隆此项目crab-popup**

    `git clone https://github.com/bobby1991qw/crab-popup.git`

2. **安装依赖包**

    `git install`
    
3. **运行项目**
    
    `gulp dev`

##用法

1. **复制crab-popup.js | crab-popup.min.js 和 crab-popup.css | crab-popup.min.css 到项目**

2. **在页面引入对应的css和js**

    `<link rel="stylesheet" href="./css/crab-popup.css">`
    
    `<link rel="stylesheet" href="./css/crab-popup.js">`

3. **html代码**

        <div id="imgs" class="imgs">                
            <img class="qw" src="http://img.vmeixi.com/uploads/2012/08/2012081501.jpg" alt="">
            <img class="qw" src="http://pic.bizhi360.com/bpic/58/1058.jpg" alt="">        
        </div>
        
4. **js代码**        
            
    `Popup.init('.imgs')`

##参数说明

1. **selector** 图片的选择器字符串，默认为img
2. **maskClosable** 允许点击遮罩层关闭弹窗，默认为true。（pc端有效）
3. **contextSelector** 图片的分组选择器，默认为空。用法如：当有表格
         
            <table id="test">                
            </table>

    其中的表格行为动态生成
            <tr class="tr">
                <td>test1</td>
                <td> <img src="xxxx" /> <img src="xxxx" /> <img src="xxxx" /> </td>
            </tr>
            
    每次点选希望只在本行图片切换时可以使用
    
            Popup.init('#imgs', {
                contextSelector: '.tr'
            })