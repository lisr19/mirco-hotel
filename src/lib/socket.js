var ip = "ws://192.168.0.122:8899/ws/";
// var ip = "ws://120.24.0.130:8899/ws/"; //外网地址
// var ip = "ws://192.168.1.166:8899/ws/";
var websocket = null;

//webSocket初始化
export function initWebSocket(userId) {
  //判断当前浏览器是否支持WebSocket
  if ('WebSocket' in window) {
    console.log('当前浏览器支持 websocket');
    websocket = new WebSocket(ip+userId);
    console.log(ip+userId)
    // websocket = new WebSocket("ws://127.0.0.1:8090/api/0.1/ws/12");
  } else {
    console.log('当前浏览器 Not support websocket')
  }

  //连接发生错误的回调方法
  websocket.onerror = function () {
    console.log("WebSocket连接发生错误");
  };
  //连接成功建立的回调方法
  websocket.onopen = function () {
    console.log("WebSocket连接成功");
  }
  //接收到消息的回调方法
  websocket.onmessage = function (event) {
    console.log(event.data)
    // if(event.data !== '连接成功')self.addCount();
  }
  //连接关闭的回调方法
  websocket.onclose = function () {
    console.log("WebSocket连接关闭");
  }
  //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
  window.onbeforeunload = function () {
    closeWebSocket();
  }
}

//关闭WebSocket连接
export function closeWebSocket() {
  websocket.close();
  websocket = null
}

export {
  websocket
}
