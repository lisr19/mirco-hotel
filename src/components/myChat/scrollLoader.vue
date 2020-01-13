<template>
  <div id="scrollLoader-container" class="container-main">
    <div class="loading" v-if="topLoading">
      <div class="loader">加载中...</div>
    </div>

    <div :style="'min-height:' + realMinHeight + 'px; overflow-x:hidden'">
      <slot></slot>
    </div>

    <!--<div class="loading" v-if="bottonLoading">-->
    <!--<div class="loader">加载中...</div>-->
    <!--</div>-->
  </div>
</template>

<script>
  export default {
    name: "scroll-loader",

    props: {
      //给slot传一个最小值，保证一开始能出现滚动条
      'minHeight': {
        type: Number,
        default: 800
      },

    },

    created() {
    },
    computed: {
      realMinHeight() {
        return this.minHeight - 30
      }
    },
    data() {
      return {
        topLoading: false,
        bottonLoading: false,

        stopTopLoading: false, //是否停止传播滚动到顶部事件
        stopBottonLoading: false,  //是否停止传播滚动到底部事件

      }
    },
    mounted() {
      this.listenScroll();
    },

    methods: {
      listenScroll() {
        let me = this;
        let topDone = (stopTopLoading) => {
          me.topLoading = false;
          if (stopTopLoading) me.stopTopLoading = true;
        };

        // let bottonDone = (stopBottonLoading) => {
        //     me.bottonLoading = false;
        //     if(stopBottonLoading) me.stopBottonLoading = true;
        // };
        setTimeout(function () {
          let scrollContainer = document.getElementById('scrollLoader-container');

          scrollContainer.onscroll = function () {
            if (scrollContainer.scrollTop <= 0 && !me.stopTopLoading) {
              if (me.topLoading) return;

              me.topLoading = true;
              me.$emit('scroll-to-top', topDone);
            }
            // if((scrollContainer.offsetHeight + scrollContainer.scrollTop+1 >= scrollContainer.scrollHeight) && !me.stopBottonLoading){
            //     if(me.bottonLoading) return;
            //
            //     me.bottonLoading = true;
            //     scrollContainer.scrollTop += 60;
            //     me.$emit('scroll-to-botton', bottonDone);
            // }
          }
        }, 50)
      },
    }
  }
</script>
<style lang="less" scoped>
  @import "scroll";
</style>
