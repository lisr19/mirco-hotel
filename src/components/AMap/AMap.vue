<template>
    <div id="container" style="width: 100%;height: 100%"></div>
</template>

<script>
  import MapLoader from '@/lib/utils/AMap.js'

  export default {
    name: "AMap",
    data(){
      return{
        map:null,
        position:[22,111]
      }
    },
    created(){
      this.position = [Number(window.location.hash.split('/')[2].split('|')[0]),Number(window.location.hash.split('/')[2].split('|')[1])]
    },
    mounted(){
      this.init()
    },
    methods:{
      init(){
        let self = this
        let position = this.position
        MapLoader().then(AMap =>{
          console.log('地图加载成功')
          self.map = new AMap.Map('container',{
            resizeEnable: true,
            zoom: 18,
            center:self.position
          })

          //插件加载
          AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
            // self.map.addControl(new AMap.ToolBar())
            self.map.addControl(new AMap.Scale())
          })

          //定位
          self.map.plugin('AMap.Geolocation', function() {
            let geolocation = new AMap.Geolocation({
              // 是否使用高精度定位，默认：true
              enableHighAccuracy: true,
              // 设置定位超时时间，默认：无穷大
              timeout: 5000,
              // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
              // buttonOffset: new AMap.Pixel(10, 20),
              //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
              zoomToAccuracy: true,
              //  定位按钮的排放位置,  RB表示右下
              // buttonPosition: 'RB'
            })

            // geolocation.getCurrentPosition()
            // AMap.event.addListener(geolocation, 'complete', onComplete)
            // AMap.event.addListener(geolocation, 'error', onError)
            //
            // function onComplete (data) {
            //   position = data.position
            //   this.currCity = data.addressComponent.city
            //   console.log(this.currCity)
            //   // data是具体的定位信息
            // }
            //
            // function onError (data) {
            //   // 定位出错
            // }
          })

          let marker = new AMap.Marker({
            map:self.map,
            position:self.position
          })
          marker.setLabel({
            offset: new AMap.Pixel(20, 20),//修改label相对于maker的位置
            // content: "点击打开高德地图"
          });
          marker.on('click',function(e){
            // console.log(1111)
            marker.markOnAMAP({
              position:marker.getPosition()
            });
            // self.returnMap()
              // window.history.go();
          })
          // if(AMap.UA.mobile){
          //   document.getElementsByClassName('info')[0].style.display='none';
          // }

        },e=>{
          console.log('地图加载失败',e)
        })
      },
      returnMap(){
        window.history.go();
      }
    },
  }
</script>

<style scoped>
#container >>> .amap-logo{
  display: none !important;
}
</style>
