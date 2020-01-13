<template>
  <div class="footer">
    <span class="price">
      <em>￥{{price}}</em>/晚
    </span>
    <Button class="btn" type="primary" @click="">{{btnName}}</Button>
  </div>
</template>

<script>
  export default {
    props: {
      title: String, // 标题
      btnName:String,
      price:Number,
    },
    data() {
      return {
      }
    },
    methods:{

    }
  }
</script>

<style lang="less" scoped>
  .footer{
    height:126px;
    background:rgba(255,255,255,1);
    box-shadow:0px 4px 8px 0px rgba(0,0,0,0.5);
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
    .price{
      color: #999999FF;
      font-family:PingFangSC-Medium;
      font-weight:500;
      font-size:28px;
      em{
        font-size:40px;
        font-weight:500;
        color:rgba(217,47,47,1);
      }
    }
    .btn{
      width:208px;
      height:80px;
      background:rgba(98,140,253,1);
      border-radius:8px;
      font-size:32px;
      font-family:PingFangSC-Medium;
      font-weight:500;
      color:rgba(255,255,255,1);
    }
  }
</style>
