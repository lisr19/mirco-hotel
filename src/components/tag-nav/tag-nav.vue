<template>
  <div class="tag-nav">
      <div v-for="(item,index) in array" class="item" :class="{active:index === currentIndex}" @click="tabNav(index)">
        <img src="" alt="">
        <p>{{item.title}}</p>
      </div>
  </div>
</template>

<script>

  export default {
    name: "tag-nav",
    data(){
      return{
        currentIndex:0,
        array:[
          {
            title:'首页',
            path:'index',
            status:true
          },
          {
            title:'消息',
            path:'message',
            status:false
          },
          {
            title:'订单',
            path:'order',
            status:false
          },
          {
            title:'我的',
            path:'my',
            status:false
          },
        ]
      }
    },
    methods:{
      tabNav(index){
        this.currentIndex = index;
      }
    }
  }
</script>

<style lang="less" scoped>
  .tag-nav{
    position: fixed;
    bottom: 0;
    display: flex;
    width: 100%;
    height:44px;
    background:rgba(255,255,255,1);
    box-shadow:0px 2px 4px 0px rgba(0,0,0,0.48);
    .item{
      width: 25%;
    }
    .active{
      color:rgba(98,140,253,1);
    }
  }
</style>
