<template>
  <div class="main">
    <head-bar title="红包/卡券"></head-bar>
    <swiper class="img-list" :options="swiperOption" ref="mySwiper">
      <!-- slides -->
      <swiper-slide class="item" v-for="item in imgList" :key="item.index">
        <img :src="item.imgUrl" alt="">
      </swiper-slide>
      <!-- Optional controls -->
      <div class="swiper-pagination"  slot="pagination"></div>
    </swiper>
    <div class="container">
      <h1>优惠券</h1>
      <ul class="title-items">
        <li v-for="(item,index) in array" class="title-item" :class="{active:index === currentIndex}" @click="tabNav(index)">
          {{item.title}}
        </li>
      </ul>
      <div class="content-items" v-if="currentIndex===0">
        <div class="content-item">
            <div class="num">￥50</div>
            <div class="desc">
              <p class="name">亮亮酒店优惠券</p>
              <p class="tip">【标准套间】满300减50优惠券</p>
              <p class="time">2019-03-23 至 2019-06-23</p>
            </div>
            <div class="btn">立<br>即<br>使<br>用</div>
          </div>
        <div class="content-item">
          <div class="num">￥100</div>
          <div class="desc">
            <p class="name">亮亮酒店优惠券</p>
            <p class="tip">【标准套间】满300减50优惠券</p>
            <p class="time">2019-03-23 至 2019-06-23</p>
          </div>
          <div class="btn">立<br>即<br>使<br>用</div>
        </div>
        <div class="content-item">
          <div class="num used-text" >￥50</div>
          <div class="desc">
            <p class="name used-text">亮亮酒店优惠券</p>
            <p class="tip used-text">【标准套间】满300减50优惠券</p>
            <p class="time used-text">2019-03-23 至 2019-06-23</p>
          </div>
          <div class="btn used-bg">已<br>使<br>用</div>
        </div>
      </div>
      <div class="content-items" v-if="currentIndex===1">
        <div class="content-item">
          <div class="num">￥100</div>
          <div class="desc">
            <p class="name">亮亮酒店优惠券</p>
            <p class="tip">【标准套间】满300减50优惠券</p>
            <p class="time">2019-03-23 至 2019-06-23</p>
          </div>
          <div class="btn">立<br>即<br>使<br>用</div>
        </div>
      </div>
      <div class="content-items" v-if="currentIndex===2">
        <div class="content-item">
          <div class="num used-text" >￥50</div>
          <div class="desc">
            <p class="name used-text">亮亮酒店优惠券</p>
            <p class="tip used-text">【标准套间】满300减50优惠券</p>
            <p class="time used-text">2019-03-23 至 2019-06-23</p>
          </div>
          <div class="btn used-bg">已<br>使<br>用</div>
        </div>
      </div>
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
        imgList:[
          {
            imgUrl:require('@/assets/img/vip1.png')
          },
          {
            imgUrl:require('@/assets/img/vip3.png')
          },
          {
            imgUrl:require('@/assets/img/vip2.png')
          },
        ],
        swiperOption: {
          slidesPerView: 1,
          spaceBetween: 10,
          centeredSlides: true,
        },
        currentIndex:0,
        array:[
          {
            title:'全部',
          },
          {
            title:'未使用',
          },
          {
            title:'已使用',
          }
        ]
      }
    },
    created() {
    },
    methods:{
      tabNav(index){
        this.currentIndex = index;
      }
    }
  }
</script>

<style lang="less" scoped>
  .main {
    background:#FAFAFCFF;
    padding-bottom: 54px;
    padding-top: 100px;
    height: 100%;
    .img-list{
      padding: 0 44px;
      margin-top: 40px;
      .item{
        width:656px;
        height:352px;
        border-radius:30px;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
    .container{
      text-align: left;
      padding: 0 40px;
      h1{
        height:56px;
        font-size:40px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height:56px;
        margin: 72px 0 30px;
      }
      .title-items{
        width:670px;
        height:66px;
        line-height: 66px;
        border-radius:10px;
        border:2px solid rgba(218,218,218,1);
        display: flex;
        align-items: center;
        .title-item{
          width:222px;
          text-align: center;
          font-size:28px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(153,153,153,1);
        }
        .active{
          background:rgba(98,140,253,1);
          border-radius:10px;
          font-size:28px;
          font-family:PingFangSC-Medium;
          font-weight:500;
          color:rgba(255,255,255,1);
        }
      }
      .content-items{
        margin-top: 30px;
        .content-item{
          width:670px;
          height:152px;
          margin-bottom: 24px;
          background:rgba(255,255,255,1);
          border:1px solid rgba(229,229,229,1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: center;
          .num{
            width: 200px;
            height:84px;
            font-size:48px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(251,111,80,1);
            line-height:66px;
            border-right: dashed  #DDDDDDFF 1px;/*no*/
          }
          .desc{
            width: 410px;
            text-align: left;
            padding-left: 22px;
            .name{
              font-size:32px;
              font-family:PingFangSC-Semibold;
              font-weight:600;
              color:rgba(51,51,51,1);
              line-height:44px;
            }
            .tip{
              font-size:24px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(102,102,102,1);
              line-height:34px;
              margin: 6px 0;
            }
            .time{
              font-size:22px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(102,102,102,1);
              line-height:32px;
            }
          }
          .btn{
            width:58px;
            height:152px;
            background:rgba(251,111,80,1);
            border-radius:0px 8px 8px 0px;
            font-size:20px;
            font-family:PingFangSC-Medium;
            font-weight:500;
            color:rgba(255,255,255,1);
            line-height:28px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        .used-text{
          color:rgba(153,153,153,1)!important;
        }
        .used-bg{
          background-color:rgba(153,153,153,1)!important;
        }
      }
    }
  }
</style>
