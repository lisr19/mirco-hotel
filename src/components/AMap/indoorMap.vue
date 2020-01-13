<template>
  <div>
    <Header :title='"室内地图"'></Header>
    <div id="indoor3d"></div>
    <div>
      <ul id="floorsUI"></ul>
    </div>
    <!--<div class="testButton">-->
      <!--<ul>-->
        <!--<li onclick="map.zoomIn(1.2)">+</li>-->
        <!--<li onclick="map.zoomOut(0.8)">-</li>-->
        <!--<li onclick="map.setTopView()">Top View</li>-->
        <!--<li onclick="map.setDefaultView()">Default View</li>-->
      <!--</ul>-->
    <!--</div>-->
  </div>
</template>

<script>
  import Header from '@/components/header/head-bar'
  export default {
    name: "indoorMap",
    components:{
      Header
    },
    data(){
      return{
        floorsUI:{}
      }
    },
    methods:{
    },
    mounted() {
      this.floorsUI = document.getElementById('floorsUI');
      let params = {
        mapDiv: "indoor3d",
        dim: "2d"
      }
      let map = IndoorMap(params);
      map.load('static/data/myHouse.json', function () {
        //map.setTheme(testTheme);
        map.showAreaNames(true).setSelectable(true);
        let ul = IndoorMap.getUI(map);
        document.body.appendChild(ul);
      });
    },
    destroyed(){
      console.log('xxx',this.floorsUI)
      this.floorsUI.style.display='none'
    }
  }
</script>
<style>
  .floorsUI-item{
    padding: 20px;
    border-bottom: 1px solid rgba(74,74,74,0.22);
  }
</style>
<style lang="less" scoped>
  @import "indoorMap";
</style>
