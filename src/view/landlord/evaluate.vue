<template>
  <div class="main">
    <head-bar title="全部评论"></head-bar>
    <div class="eva-infor">
      <h1>共{{total}}条评论</h1>
    </div>
    <div class="items">
      <div class="item" v-for="item in evalList">
        <div class="used-infor">
          <div style="display: flex">
            <img  :src="item.avatar" alt="">
            <div>
              <p class="name">{{item.username}}</p>
              <p class="time">{{item.evaluateTime}}</p>
            </div>
          </div>
          <div class="content">
            {{item.content}}
          </div>
        </div>
        <Rate class="rate" disabled v-model="item.grade"/>
      </div>
    </div>
  </div>
</template>

<script>
  import headBar from '@/components/header/head-bar'
  import {getEvalListByHome} from "@/lib/API/comment";
  export default {
    components: {
      headBar
    },
    data() {
      return {
        evalList:[],//评论列表
        total:0,//评论总数
      }
    },
    created(){
      this.getEvalListByHome({id:this.$route.query.id})
    },
    methods: {
      //获取酒店所有评论
      async getEvalListByHome(params){
        let res = await getEvalListByHome(params)
        if(res.code === 200){
          this.evalList = res.data.list
          this.total = res.data.total
        }
      },
    }
  }
</script>

<style scoped>
  .main >>> .ivu-icon{
    font-size: 40px;
    color: #979797FF;
  }
  .eva-infor >>> .ivu-rate-star{
  }
  .eva-infor >>> .ivu-rate-star-full:before{
    color: #626BFDFF;
  }
  .eva-infor >>> .ivu-rate-star-half .ivu-rate-star-content:before{
    color: #626BFDFF;
  }
</style>
<style lang="less" scoped>
  .main {
    background-color: #FAFAFCFF;
    height: 100%;
    padding: 148px 40px 0;
    .eva-infor{
      text-align: left;
      h1{
        font-size:48px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height:66px;
      }
      ul{
        margin: 42px 0 60px;
        li{
          font-size:28px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(51,51,51,1);
          line-height:40px;
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
        }
      }
    }
    .items{
      .item{
        border-bottom: solid 1px #D4D4D4;
        padding-top: 40px;
        position: relative;
        .used-infor{
          display: flex;
          text-align: left;
          flex-direction: column;
          img{
            width:72px;
            height:72px;
            margin-right: 12px;
            border-radius: 50%;
          }
          .name{
            font-size:24px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(51,51,51,1);
            line-height:34px;
          }
          .time{
            color: #666666;
          }
          .content{
            font-size:20px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(51,51,51,1);
            margin: 28px 0 30px;
          }
        }
        .rate{
          position: absolute;
          top: 40px;
          right: 0;
        }
      }
    }
  }
</style>
