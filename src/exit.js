
document.addEventListener('plusready', function () {
    var webview = plus.webview.currentWebview();
    // plus.navigator.setStatusBarColor('#000')
    // plus.navigator.setStatusBarBackground('#F5F5F5');//设置顶部颜色
    // plus.navigator.setStatusBarStyle('background:#F5F5F5')
    plus.key.addEventListener('backbutton', function () {
      webview.canBack(function (e) {
            if (e.canBack) {
              console.log('物理键返回');
              if(plus.webview.getTopWebview().getURL().includes('https://location.seeklane.com/seeklane/')){
                plus.webview.close('室内导航');
              }else {
                webview.back();
              }
            } else {
              console.log('首页退出');
              plus.webview.close('室内导航');
              //首页返回键处理
                //处理逻辑：1秒内，连续两次按返回键，则退出应用；
                var first = null;
                plus.key.addEventListener('backbutton', function () {
                  //首次按键，提示‘再按一次退出应用’
                    if (!first) {
                        first = new Date().getTime();
                        // alert('再按一次退出应用');//返回提示
                        setTimeout(function () {
                            first = null;
                        }, 500);
                    } else {
                        if (new Date().getTime() - first < 1500) {
                            plus.runtime.quit();
                        }
                    }
                }, false);
            }
        })
    })
});
