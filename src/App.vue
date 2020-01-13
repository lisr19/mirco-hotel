
 <template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
  import home from '@/view/home/home'

  export default {
    name: 'App',
    components: {
      home
    },
    data(){
      return{
        receiverId:null
      }
    },
    created() {
      if(localStorage.getItem('MicroHotelUserData')){
        this.receiverId = localStorage.getItem('MicroHotelUserData').split(',')[0]
        this.sendSock(this.receiverId)
      }
    },
    methods: {
    // socket连接
      sendSock(receiverId) {
        let self = this
        if (self.socketApi.websocket == null) {
          this.socketApi.initWebSocket(receiverId)
        } else {
          if (!self.connect) {
            self.socketApi.websocket.onmessage = function (event) {
              console.log(event.data)
            }
          }
        }
      }
    }
  }
</script>

<style>
  #app {
    /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
    font-family: PingFangSC-Medium;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
</style>
