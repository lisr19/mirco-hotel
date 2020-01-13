<template>
  <div class="page">
    <!--首页-->
    <indexPage v-if="currentIndex===0"></indexPage>
    <!--消息-->
    <message v-else-if="currentIndex===1"></message>
    <!-- 订单 -->
    <order v-else-if="currentIndex===2"></order>
    <!-- 个人中心 -->
    <myIndex v-else-if="currentIndex===3"></myIndex>
    <!--脚部NAV切换-->
    <div class="tag-nav" v-show="hideshow">
      <div v-for="(item,index) in array" class="item" :class="{active:index === currentIndex}" @click="tabNav(index)">
        <img :src="item.iconUrl2" alt="" v-if="index === currentIndex">
        <img :src="item.iconUrl" alt="" v-else>
        <div class="flag" v-if="index === 1 && count>0">{{count}}</div>
        <p>{{item.title}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import order from '@/view/order/order'
  import indexPage from '@/view/home/index-page'
  import myIndex from '@/view/my/my-index'
  import message from '@/view/message/message'
  import {mapGetters} from 'vuex'
  import { MessageBox  } from 'mint-ui';
  export default {
    name: "home",
    components: {
      order,
      indexPage,
      myIndex,
      message
    },
    computed:{
      ...mapGetters(['count'])
    },
    watch:{
      showHeight() {
        if(this.docmHeight > this.showHeight){
          this.hideshow=false
        }else{
          this.hideshow=true
        }
      }
    },
    data() {
      return {
        docmHeight: document.documentElement.clientHeight,  //默认屏幕高度
        showHeight: document.documentElement.clientHeight,   //实时屏幕高度
        hideshow:true,  //显示或者隐藏footer
        userID:'',
        currentIndex:0,
        swiperOption: {
          notNextTick: true,
          pagination: '.swiper-pagination',
          slidesPerView: 'auto',
          centeredSlides: true,
          paginationClickable: true,
          spaceBetween: 30,
        },
        array:[
          {
            title:'首页',
            path:'index',
            status:true,
            iconUrl: require('@/assets/icon/index.png'),
            iconUrl2: require('@/assets/icon/index-active.png'),
          },
          {
            title:'消息',
            path:'news',
            iconUrl: require('@/assets/icon/news.png'),
            iconUrl2: require('@/assets/icon/news-active.png'),
            status:false
          },
          {
            title:'订单',
            path:'order',
            iconUrl: require('@/assets/icon/order.png'),
            iconUrl2: require('@/assets/icon/order-active.png'),
            status:false
          },
          {
            title:'我的',
            path:'my',
            iconUrl: require('@/assets/icon/my.png'),
            iconUrl2: require('@/assets/icon/my-active.png'),
            status:false
          },
        ]
      }
    },
    created() {
      this.userID = localStorage.getItem('MicroHotelUserData')
      console.log(this.$route.params.isLogin);
      // if(this.userID){
      //   this.userID=this.userID.split(',')[0];
      // }else{
      //   this.$router.push('/login-enroll');
      // }
    },
    activated(){
      this.init()
    },
    mounted() {
      window.onresize = ()=>{
        return(()=>{
          this.showHeight = document.body.clientHeight;
        })()
      }
    },
    methods: {
      init(){
        if(this.$route.params.isLogin){
          this.$router.go(0)
        }
      },
      tabNav(index){
        if(this.userID){
          this.userID=this.userID.split(',')[0]
          this.currentIndex = index;
        }else{
          MessageBox.confirm('您还未登陆，现在去登陆?').then(action => {
            if(action==='confirm'){
              this.$router.push({name:'登录注册'})
            }
          }).catch(() => {
            console.log('取消');
          })
        }
      }
    }
  }
</script>


<style lang="less" scoped>
  .page{
    height: 100%;
  }
  .index-box{
    .banner{
      .imglist{
        .item{
          height:468px;
          background: aqua;
        }

      }
    }
    .card{
      width:670px;
      height:476px;
      background:rgba(255,255,255,1);
      box-shadow:0px 8px 10px 0px rgba(0,0,0,0.08);
      border-radius:20px;
      margin: 0 auto;
      padding: 32px 30px;
      position: absolute;
      top: 240px;
      left: 40px;
      z-index: 9;
    }
  }
  .tag-nav{
    position: fixed;
    bottom: 0;
    display: flex;
    width: 100%;
    height:88px;
    background:rgba(255,255,255,1);
    box-shadow:0px 4px 8px 0px rgba(0,0,0,0.48);
    .item{
      width: 25%;
      display: flex;
      text-align: center;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img{
        /*max-width: 40px;*/
        max-height: 42px;
      }
      p{
        height:26px;
        font-size:18px;
        font-family:PingFangSC-Medium;
        font-weight:500;
      }
      position: relative;
      .flag{
        position: absolute;
        right: 28%;
        top:0;
        width: 32px;
        height: 32px;
        background: rgba(255, 90, 96, 1);
        border-radius: 50%;
        text-align: center;
        font-size: 16px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 33px;
      }
    }
    .active{
      color:rgba(98,140,253,1);
    }
  }
</style>
