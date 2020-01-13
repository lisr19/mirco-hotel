<template>
  <div class="main">
    <head-bar title="便民服务"></head-bar>
    <div class="banner">
      <img src="@/assets/img/jiankang.png" alt="">
    </div>
    <div class="card">
      <h3>健康数据</h3>
      <swiper class="item-list" :options="swiperOption" ref="mySwiper">
        <swiper-slide class="item" v-for="item in typeList" :style="{'background':item.color}" :key="item.index">
         {{item.name}}
        </swiper-slide>
      </swiper>
    </div>
    <div class="card">
      <h3>健康资讯</h3>
      <img src="@/assets/img/zixun.png" alt="">
      <p class="txt">健康资讯面向普通大众,提供医疗卫生行业资讯,报道最新医疗科研动态,追踪健康新闻焦点事件,解读健康资讯热点话题给…</p>
    </div>
    <div class="card">
      <h3>医疗资讯</h3>
      <img src="@/assets/img/yiliao.png" alt="">
      <p class="txt">中国人民解放军总医院（301医院）创建于1953年，是集医疗、保健、教学、科研于一体的大型现代化综合性医院…</p>
    </div>
    <div class="card">
      <h3>培训服务</h3>
      <img src="@/assets/img/peixun.png" alt="">
    </div>
  </div>
</template>

<script>
  import headBar from '@/components/header/head-bar'

  export default {
    components:{
      headBar
    },
    data() {
      return {
        typeList:[
          {
            name:'血压',
            color:'#FDC662',
          },
          {
            name:'血糖',
            color:'#68D26C',
          },
          {
            name:'体重',
            color:'#F5AF17',
          },
          {
            name:'步数',
            color:'#07A4EE',
          },
        ],
        swiperOption: {
          notNextTick: true,
          slidesPerView: 'auto',
          spaceBetween: 12,
        },
        currentIndex:0,
      }
    },
    created() {
    },
    methods:{
    }
  }
</script>


<style lang="less" scoped>
  .main {
    background:#DDDDDD;
    padding-bottom: 54px;
    padding-top: 90px;
    overflow: hidden;
    .banner{
     img{
       width: 100%;
       vertical-align: top;
     }
    }
    .card{
      background:rgba(255,255,255,1);
      margin-top: 20px;
      padding: 20px 18px;
      position: relative;
      h3{
        font-size:32px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height:50px;
        margin-bottom: 28px;
        text-align: left;
      }
      .item-list{
        .item{
          width:160px;
          height:68px;
          line-height:68px;
          background:rgba(245,143,110,1);
          border-radius:12px;
          font-size:30px;
          font-family:PingFangSC-Medium;
          font-weight:500;
          color:rgba(255,255,255,1);
        }
      }
      img{
        width: 700px;
        vertical-align: top;
      }
      .txt{
        width: 700px;
        height:80px;
        background:rgba(82,82,82,0.5);
        border-radius:0px 0px 16px 16px;
        text-align: left;
        font-size:24px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height:34px;
        padding: 0 12px;
        position: absolute;
        bottom: 20px;
      }
    }
  }
</style>
