import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path:'*',
      redirect:'/index'
    },
    {
      path: '/index',
      name: '首页',
      meta: { keepAlive: true },
      component: (resolve) => require(['@/view/home/home.vue'], resolve),
    },
    {
      path: '/login-enroll',
      name: '登录注册',
      component: (resolve) => require(['@/view/login-enroll/login-enroll.vue'], resolve),
    },
    {
      path: '/my-data',
      name: '我的',
      meta: { keepAlive: true },
      component: (resolve) => require(['@/view/my/my-data.vue'], resolve),
    },
    {
      path: '/quit',
      name: '退出账号',
      component: (resolve) => require(['@/view/my/quit.vue'], resolve),
    },
    {
      path: '/collect',
      name: '收藏',
      component: (resolve) => require(['@/view/my/collect.vue'], resolve),
    },
    {
      path: '/coupon',
      name: '优惠券',
      component: (resolve) => require(['@/view/my/coupon.vue'], resolve),
    },
    {
      path: '/comment',
      name: '评论',
      component: (resolve) => require(['@/view/my/comment.vue'], resolve),
    },
    {
      path:'/order-details',
      name: '订单详情',
      // meta: { keepAlive: true },
      component: (resolve) => require(['@/view/order/order-details/order-details.vue'], resolve),
    },
    {
      // 编辑器
      path: '/write',
      name: 'Write',
      meta: { keepAlive: true },
      component: (resolve) => require(['@/components/write/write.vue'], resolve),
    },
    {
      // 搜索酒店列表
      path: '/hotel-list',
      name: 'hotel-list',
      component: (resolve) => require(['@/view/hotel-list.vue'], resolve),
    },
    {
      // 酒店详情
      path: '/hotel-detail',
      name: 'hotel-detail',
      component: (resolve) => require(['@/view/hotel-detail.vue'], resolve),
    },
    {
      // 民宿详情
      path: '/home-detail',
      name: 'home-detail',
      component: (resolve) => require(['@/view/home-detail.vue'], resolve),
    },
    {
      // 房间列表
      path: '/room-list',
      name: 'room-list',
      component: (resolve) => require(['@/view/room-list.vue'], resolve),
    },
    {
      // 房间详情
      path: '/room-detail',
      name: 'room-detail',
      component: (resolve) => require(['@/view/room-detail.vue'], resolve),
    },
    {
      // 通知
      path: '/notice',
      name: 'notice',
      component: (resolve) => require(['@/view/message/notice.vue'], resolve),
    },
    {
      // 聊天
      path: '/chat',
      name: 'chat',
      component: (resolve) => require(['@/view/message/chat.vue'], resolve),
    },
    {
      // 预定房间详情
      path: '/plan-detail',
      name: 'plan-detail',
      meta: { keepAlive: true },
      component: (resolve) => require(['@/view/plan-room/plan-detail.vue'], resolve),
    },
    {
      // 支付房费
      path: '/pay',
      name: 'pay',
      // meta: { keepAlive: true },
      component: (resolve) => require(['@/view/plan-room/pay.vue'], resolve),
    },
    {
      // 支付成功
      path: '/pay-success',
      name: 'pay-success',
      meta: { keepAlive: true },
      component: (resolve) => require(['@/view/plan-room/pay-success.vue'], resolve),
    },
    {
      // 房东
      path: '/landlord',
      name: 'landlord',
      meta: { keepAlive: true },
      component: (resolve) => require(['@/view/landlord/landlord.vue'], resolve),
    },
    {
      // 房东评价列表
      path: '/landlord-evaluate',
      name: 'landlord-evaluate',
      component: (resolve) => require(['@/view/landlord/evaluate.vue'], resolve),
    },
    {
      // 房东详情
      path: '/landlord-detail',
      name: 'landlord-detail',
      component: (resolve) => require(['@/view/landlord/landlord-detail.vue'], resolve),
    },
    {
      // 房东申请
      path: '/landlord-apply',
      name: 'landlord-apply',
      // meta: { keepAlive: true },
      component: (resolve) => require(['@/view/landlord/landlord-apply.vue'], resolve),
    },
    {
      // 房东房间信息
      path: '/landlord-roomlist',
      name: 'landlord-roomlist',
      meta: { keepAlive: true },
      component: (resolve) => require(['@/view/landlord/landlord-roomlist.vue'], resolve),
    },
    {
      // 房东房间信息
      path: '/landlord-room',
      name: 'landlord-room',
      // meta: { keepAlive: true },
      component: (resolve) => require(['@/view/landlord/landlord-room.vue'], resolve),
    },
    {
      // 房东设置可订状态
      path: '/landlord-time',
      name: 'landlord-time',
      component: (resolve) => require(['@/view/landlord/landlord-time.vue'], resolve),
    },
    {
      // 房东设置预订条件
      path: '/landlord-condition',
      name: 'landlord-condition',
      component: (resolve) => require(['@/view/landlord/landlord-condition.vue'], resolve),
    },
    {
      // 室内地图
      path: '/indoorMap',
      name: 'indoorMap',
      component: (resolve) => require(['@/components/AMap/indoorMap'], resolve),
    },
    {
      // 房东订单详情
      path: '/landlord-order',
      name: '房东订单详情',
      component: (resolve) => require(['@/view/landlord/landlord-order.vue'], resolve),
    },
    {
      // 地图
      path: '/amap/:id',
      name: '高德地图',
      component: (resolve) => require(['@/components/AMap/AMap.vue'], resolve),
    },
    {
      // 更多筛选
      path: '/more-select',
      name: '更多筛选',
      meta: { keepAlive: true },
      component: (resolve) => require(['@/view/more-select'], resolve),
    },
    {
      // 酒店全部评价
      path: '/evaluate',
      name: '全部评价',
      component: (resolve) => require(['@/view/evaluate'], resolve),
    },
    {
      // 友情链接便民服务
      path: '/friendship-links',
      name: '便民服务',
      component: (resolve) => require(['@/view/my/friendship-links'], resolve),
    },
    {
      // 房东评价管理
      path: '/home-list',
      name: '房东评价管理',
      component: (resolve) => require(['@/view/landlord/home-list'], resolve),
    }

  ]
})
