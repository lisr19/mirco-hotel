<template>
  <div class="msg" :style="'minHeight:'+minHeight+'px'">
    <div class="msg-title">消息</div>
    <div class="msg-list" v-if="dataList.length">
      <ul>
        <li v-for="(item,index) in dataList">
          <div @click="openViewByPath(item)">
            <img :src="item.logoUrl"/>
            <div>
              <div class="header">
                <span>{{item.name}}</span>
                <span>{{item.time}}</span>
              </div>
              <div class="content">
                <span>{{item.content}}</span>
                <div v-if="item.count !== 0">{{item.count}}</div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="msg-null">
      <img src="@/assets/icon/msg-null.png" alt="">
    </div>
    <!--<AMap></AMap>-->
  </div>
</template>

<script>
  import {getMsgList} from '@/lib/API/message'

  export default {
    name: "message",
    // components: {
    //   AMap
    // },
    data() {
      return {
        paths: ['/notice', '/chat', '/notice'],
        minHeight: window.screen.height,
        dataList: [
          {
            id: 1,
            name: '会议通知',
            time: '12:20',
            content: '距离您今天(2019年2月18日，下午14:00)在…',
            logoUrl: '',
            path: '/notice'
          }
        ],
        userId: localStorage.getItem('MicroHotelUserData').split(',')[0]
      }
    },
    created() {
      this.getMsgList()
    },
    mounted() {
      let self = this
      if (!self.connect) {
        self.socketApi.websocket.onmessage = function (event) {
          console.log(event)
          let data = JSON.parse(JSON.parse(event.data))
          self.dataList.forEach(v => {
            if (v.id == data.senderId) {
              let params = {
                id: v.id
              }
              self.$store.dispatch('addTip', params)
            }
          })
        }
      }
    },
    activated() {
      let self = this
      if (!self.connect) {
        self.socketApi.websocket.onmessage = function (event) {
          console.log(event)
          let data = JSON.parse(JSON.parse(event.data))
          self.dataList.forEach(v => {
            if (v.id == data.senderId) {
              let params = {
                id: v.id
              }
              self.$store.dispatch('addTip', params)
            }
          })
        }
      }
    },
    methods: {
      openViewByPath(item) {
        this.$router.push({
          path: item.path,
          query: {
            id: item.id,
            logoUrl: item.logoUrl,
            name: item.name
          }
        })
        let params = {
          id: item.id
        }
        this.$store.dispatch('clearTip', params)
      },
      async getMsgList() {
        let res = await getMsgList({userId: this.userId});
        let self = this
        // console.log(res)
        if (res.code === 200) {
          this.dataList = [];
          let array = [];
          let lists = res.data.list;
          for (let i = 0; i < lists.length; i++) {
            array.push({
              id: lists[i].id,
              name: lists[i].name,
              time: lists[i].addTime,
              logoUrl: lists[i].avatar,
              content: lists[i].message,
              count: 0,
              path: '/chat'
            })
          }
          self.dataList = self.$store.state.tip
          let result = self.getArrDifference(self.$store.state.tip, array)
          self.dataList = self.dataList.concat(result)
          self.$store.dispatch('setTip', self.dataList)
        }
      },
      //取出两个数组中不同的元素

      getArrDifference(arr1, arr2) {
        let result = []
        if (arr1.length > 0) {
          for (let i = 0; i < arr1.length; i++) {
            let obj = arr1[i];
            let id = obj.id;
            let isExist = false;
            for (let j = 0; j < arr2.length; j++) {
              let aj = arr2[j];
              let id2 = aj.id;
              if (id === id2) {
                isExist = true;
                break;
              }
            }
            if (!isExist) {
              result.push(obj);
            }
          }
        } else {
          result = arr2
        }
        return result
      }
    },
  }
</script>

<style lang="less" scoped>
  @import "message";
</style>
