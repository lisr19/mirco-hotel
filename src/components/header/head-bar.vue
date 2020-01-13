<template>
  <div class="head-bar">
    <Icon type="ios-arrow-back" @click="goBack"/>
    {{title}}
  </div>
</template>

<script>
  export default {
    name: "head-bar",
    props: {
      title: String // 标题
    },
    data() {
      return {
        isBack:false
      }
    },
    methods:{
      goBack(){
        if(this.title=='订单详情'){
          this.$router.push({name:'首页'})
        }else{
          this.$router.back();//返回上一层
        }
      },
    }
  }
</script>
<style scoped>
  .head-bar >>> .ivu-icon{
    font-size: 58px;
    color: #333333FF;
    position: absolute;
    left: 20px;
  }
</style>
<style lang="less" scoped>
  .head-bar{
    width: 100%;
    height:90px;
    line-height:90px;
    background:rgba(245,245,245,1);
    box-shadow:0px 4px 8px 0px rgba(0,0,0,0.05);
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size:28px;
    font-weight:600;
    color:#484848FF;
    z-index: 50;
  }
</style>
