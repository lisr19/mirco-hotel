<template>
  <div class="main">
    <head-bar title="评价管理"></head-bar>
    <div class="home-item" v-for="item in homeList" @click="openEval(item)">
      <img :src="item.image1" alt="">
      <div class="desc">
        <p class="name">
          {{item.name}}
        </p>
        <div class="address">{{item.address}}</div>
        <div class="score">
          <Rate disabled v-model="item.grade"/>
        </div>
      </div>
      <span class="num">{{item.evaluationNum }}条评论</span>
    </div>
  </div>
</template>

<script>
  import headBar from '@/components/header/head-bar'
  import {getHomeList} from "@/lib/API/landlord";
  export default {
    components: {
      headBar
    },
    data() {
      return {
        homeList:[]
      }
    },
    created(){
      this.userID = localStorage.getItem('MicroHotelUserData').split(',')[0];
      this.getHomeList()
    },
    methods: {
      //获取房源列表
      async getHomeList(){
        let params = {
          deleted:0,
          userId:this.userID,
          size:50
        }
        let res = await getHomeList(params)
        if(res.code === 200){
          this.homeList = res.data.list
        }
      },
      //评论
      openEval(item){
        this.$router.push({path:'/landlord-evaluate',query:{id:item.id}})
      }
    }
  }
</script>

<style scoped>
  .main >>> .ivu-rate-star{
    font-size: 32px;
    margin: 0 2px;
  }
  .main >>> .ivu-rate{
    display: flex;
  }
</style>

<style lang="less" scoped>
  .main {
    background-color:#F8F9FB;
    height: 100%;
    padding: 100px 0;
    .home-item{
      margin: 0 auto 20px;
      padding: 18px 40px;
      display: flex;
      overflow: hidden;
      background:rgba(255,255,255,1);
      position: relative;
      .num{
        font-size:30px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        position: absolute;
        right: 25px;
        bottom: 20px;
      }
      img{
        width:176px;
        height:176px;
        display: block;
        border-radius: 5px;
      }
      .desc{
        text-align: left;
        padding-left: 20px;
        font-family:PingFangSC-Semibold;
        color:rgba(51,51,51,1);
        font-weight:600;
        .name{
          font-size:36px;
          font-family:PingFangSC-Medium;
          font-weight:600;
          color:rgba(51,51,51,1);
          line-height:50px;
          .tip{
            display: inline-block;
            img{
              height: 34px;
              width: auto;
            }
          }
        }
        .address{
          font-size:24px;
          font-family:PingFangSC-Regular;
          font-weight:500;
          color:rgba(51,51,51,1);
          line-height:40px;
        }
        .price{
          span{
            font-size:32px;
            font-family:PingFangSC-Semibold;
            font-weight:600;
            color:rgba(217,47,47,1);
            line-height:44px;
          }
        }
        .score{
          margin-top: 4px;
        }
      }
    }
  }
</style>
