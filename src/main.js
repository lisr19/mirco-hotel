// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import './common/less/reset.less'
import 'iview/dist/styles/iview.css'
import 'swiper/dist/css/swiper.css'
import 'lib-flexible/flexible.js'
import 'mint-ui/lib/style.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import Calendar from 'vue2-datepick';
import store from './store'
import * as socketApi from '../src/lib/socket'
import exit from "./exit";//监听返回
import Toast from './components/toast/toast'
import Mint from 'mint-ui';
import flexible from "./flexible";


Vue.use(Mint);
Vue.use(exit)
Vue.use(iView)
Vue.use(VueAwesomeSwiper)
Vue.use(Calendar)
Vue.use(Toast);
Vue.config.productionTip = false
Vue.prototype.socketApi = socketApi

/**
 * 转换成图片表情
 */
function toEmotion(text, isNoGif){
  var list = ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '愉快', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动', '街舞', '献吻', '左太极', '右太极', '嘿哈', '捂脸', '奸笑', '机智', '皱眉', '耶', '红包', '鸡'];

  if (!text) {
    return text;
  }

  text = text.replace(/\[[\u4E00-\u9FA5]{1,3}\]/gi, function(word){
    var newWord = word.replace(/\[|\]/gi,'');
    var index = list.indexOf(newWord);
    var backgroundPositionX = -index * 24
    var imgHTML = '';
    if(index<0){
      return word;
    }

    if (isNoGif) {
      if(index>104){
        return word;
      }
      imgHTML = `<i class="static-emotion" style="background:url(https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/default218877.gif) ${backgroundPositionX}px 0;"></i>`
    } else {
      var path = index>104 ? '/img' : 'https://res.wx.qq.com/mpres/htmledition/images/icon';
      imgHTML = `<img class="static-emotion-gif" style="vertical-align: middle" src="${path}/emotion/${index}.gif">`
    }
    return imgHTML;
  });
  return text;
}
/**
 * 时间筛选
 */
Date.prototype.toString = function (f) {
  if (!f) f = 'yyyy-MM-dd HH:mm:ss'
  var h12 = this.getHours() > 12 ? (this.getHours() - 12) : this.getHours()
  var week = '日一二三四五六'
  var tmp = {
    'yyyy': this.getFullYear(),
    'yy': parseInt(this.getFullYear().toString().substr(2, 2)),
    'MM': addZero(this.getMonth() + 1),
    'M': this.getMonth() + 1,
    'dd': addZero(this.getDate()),
    'd': this.getDate(),
    'hh': (h12 < 10 ? '0' : '') + h12,
    'h': h12,
    'HH': addZero(this.getHours()),
    'H': this.getHours(),
    'mm': addZero(this.getMinutes()),
    'm': this.getMinutes(),
    'ss': addZero(this.getSeconds()),
    's': this.getSeconds(),
    'week': '星期' + week.substr(this.getDay(), 1)
  }
  for (var p in tmp) f = f.replace(new RegExp('\\b' + p + '\\b', 'g'), tmp[p])
  return f
}

Vue.filter('formatTime', (value, f) => {
  if (typeof value == 'string') {
    value = new Date(value.replace(/-/g, "/"))
  } else {
    value = new Date(value)
  }
  return value.toString(f)
})

function addZero(val) {
  if (val < 10) {
    return '0' + val
    // return val
  } else {
    return val
  }
}


Vue.directive('emotion', {
  bind: function (el, binding) {
    el.innerHTML = toEmotion(binding.value)
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})


router.beforeEach((to, from, next) => {
	const token = localStorage.getItem('token')
	 if (!token && to.path === '/login-enroll') {
		// 未登陆且要跳转的页面是登录页
		next() // 跳转
	} else if (token && to.path === '/login-enroll') {
		// 已登录且要跳转的页面是登录页
		next({
			path: '/index' // 跳转到首页
		})
	} else {
		next() // 跳转
	}
})
export default router
