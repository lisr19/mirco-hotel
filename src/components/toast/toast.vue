<template>
  <!-- 全局提示框 -->
  <div v-show="visible" class="toast">
    <div>{{message}}</div>
  </div>

</template>
<script>
  export default {
    data() {
      return {
        visible: false,
        message: ""
      };
    }
  };
</script>
<style scoped>
  .toast{
    position: fixed;
    z-index: 100;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    max-width: 80%;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
    text-align: center;
    padding: 20px;
    line-height: 1.5;
    font-size: 26px
  }
</style>
