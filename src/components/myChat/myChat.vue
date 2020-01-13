//微信聊天可视化组件
//依赖scrollLoader组件, 依赖指令v-emotion（实现请查看main.js）

//参数：
// width               组件宽度，默认450
// wrapBg              外层父元素背景颜色，默认#efefef
// maxHeight           展示窗口最高高度, 默认900
// contactAvatarUrl    好友头像url
// ownerAvatarUrl      微信主人头像url
// ownerNickname       微信主人昵称
// getUpperData        （必需）当滚动到上方时加载数据的方法，返回值要为Promise对象，resolve的结构同data
// getUnderData        （必需）当滚动到下方时加载数据的方法，返回值同上
// data                （必需）传入初始化数据， 结构如下：
[{
direction: 2, //为2表示微信主人发出的消息，1表示联系人
id: 1, //根据这个来排序消息
type: 1, //1为文本，2为图片
content: '你好!![呲牙]', //当type为1时这里是文本消息，当type2为2时这里要存放图片地址；后续会支持语音的显示
ctime: new Date().toLocaleString() //显示当前消息的发送时间
},
{
direction: 1,
id: 2,
type: 1,
content: '你也好。[害羞]',
ctime: new Date().toLocaleString()
}]


<template>
  <div class="wxchat-container">
    <div class="window" id="window-view-container">
      <!-- data is empty -->
      <div class="loading" v-if="dataArray && dataArray.length==0">
        <div style="margin-top: 300px;text-align:center; font-size: 16px;">
          <span>未查找到聊天记录</span>
        </div>
      </div>

      <!-- loading -->
      <div class="loading" v-if="dataArray.length===0">
        <div style="margin-top: 300px;">
          <div>加载中...</div>
        </div>
      </div>
      <!--<div class="title" v-if="dataArray && dataArray.length>0">-->
      <!--<p v-text="contactNickname"></p>-->
      <!--</div>-->
      <!-- main -->
      <ScrollLoader ref="scrollLoader" :minHeight="minHeight" @scroll-to-top="refresh" @scroll-to-botton="infinite"
                    v-if="dataArray && dataArray.length>0" :style="{maxHeight: maxHeight-50 + 'px'}">
        <div class="message" id="message">
          <ul>
            <li v-for="(message, index) in dataArray"
                :class="message.direction===2?'an-move-right':'an-move-left'" :key="index">
              <p class="time"><span v-text="message.ctime"></span></p>
              <p class="time system" v-if="message.type===10000"><span v-html="message.content"></span></p>
              <div :class="'content' + (message.direction===2?' self':'')" v-else>
                <img class="avatar" :src="message.direction===2? ownerAvatarUrl: contactAvatarUrl">
                <!-- 文本 -->
                <div class="text" v-emotion="message.content" v-if="message.type===1"></div>

                <!-- 图片 -->
                <div class="text" v-else-if="message.type===2">
                  <img :src="message.content" class="image" alt="聊天图片">
                </div>

                <!-- 其他 -->
                <div class="text" v-else-if="message.type!==10000"
                     v-text="'[暂未支持的消息类型:'+ message.type +']\n\r' + message.content">

                </div>
              </div>
            </li>

          </ul>
        </div>
      </ScrollLoader>
    </div>
    <div class="cover" id="cover" v-if="selectShow" @click="onfocusInput()"></div>
    <!--底部-->
    <div class="footer" id="footer">
      <div class="footer-input" id="footer-input">
        <!--<img src="" style="margin-right: 0"/>-->
        <input type="text" placeholder="请输入内容" @focus="onfocusInput()" ref="input_enter" @blur="onblurInput" v-model="inputValue"/>
        <img src="@/assets/icon/keyboard.png" @click="showSelect()"/>
        <!--<img src="" style="margin-right: 0"/>-->
      </div>
      <div class="select" v-if="selectShow">
        <div class="scroll">
          <div class="item" v-for="(item,index) in selectArray" :key="index" @click="changeItem(index)">{{item.content}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ScrollLoader from './scrollLoader.vue';

  export default {
    name: "myChat",
    components: {
      ScrollLoader
    },
    props: {
      // contactNickname: {
      //     type: String,
      //     default: 'Mystic Faces'
      // },

      height:{
        type:Number,
        default:300
      },
      otherId:{
        type:Number,
        default:0
      },
      userId:{
        type:String,
        default:0
      },

      data: {
        type: Array,
        required: true
      },

      wrapBg: {
        type: String,
        default: '#E0E2E4'
      },

      contactAvatarUrl: {
        type: String,
      },

      ownerAvatarUrl: {
        type: String,
      },

      getUpperData: {
        type: Function,
        required: true
      },

      getUnderData: {
        type: Function,
        required: true
      }
    },

    data() {
      return {
        isUpperLaoding: false,
        isUnderLaoding: false,
        maxHeight:0,
        minHeight:0,
        inputHeight:0,
        selectShow:false,
        isRefreshedAll: false,
        isLoadedAll: false,
        dataArray: [],
        inputValue:'',
        selectArray:[
          {
            content:'房东好，你的房子看起来很棒哦'
          },
          {
            content:'你好，能说说房子的基本情况吗'
          },
          {
            content:'请问我怎么过去？'
          }
        ],
      }
    },

    created() {
      this.initData();
    },
    mounted() {
      let self = this
      document.onkeydown = function(e){
        if(e.keyCode === 13){
          self.dataArray.push({
            direction:2,
            ctime:new Date().toLocaleString(),
            content:self.inputValue,
            type:1,
          })
          let msg = {
            message:self.inputValue,
            receiverId:self.otherId,
            senderId:self.userId,
            typeId:1
          }
          self.sendMsg(msg)
          self.inputValue = ''
        }
      }
      this.minHeight = document.getElementById('window-view-container').offsetHeight-document.getElementById('footer').offsetHeight
      this.maxHeight = document.getElementById('window-view-container').offsetHeight-document.getElementById('footer').offsetHeight
      // this.scrollToBottom()
    },

    methods: {
      showSelect(){
        let self = this
        self.selectShow = !self.selectShow
        if(self.selectShow){
          setTimeout(()=>{
            self.inputHeight = document.getElementById('footer').offsetHeight
            document.getElementById('cover').style.height = window.screen.height-self.inputHeight - self.height+'px'
          },100)
        }else{
          self.$refs.input_enter.focus()
          self.onfocusInput()
        }
      },
      onfocusInput(){
        this.selectShow = false
        this.scrollToBottom()
      },
      onblurInput(){
        this.onfocusInput()
      },
      //滑动到底部
      scrollToBottom(){
        let self = this
        setTimeout(()=>{
          //滑动到底部
          self.$refs.scrollLoader.$el.scrollTop = self.$refs.scrollLoader.$el.scrollHeight
        },100)
      },
      //将接收的消息加入数组中
      pushMsgIntoArray(data){
        if(data.senderId != this.userId){
          this.dataArray.push({
            direction:1,
            ctime:new Date().toLocaleString(),
            content:data.message,
            type:1,
          })
        }
        this.scrollToBottom()
      },
      //发送消息
      sendMsg(msg){
        msg = JSON.stringify(msg)
        this.socketApi.websocket.send(msg)
        this.scrollToBottom()
      },
      changeItem(index){
        let data = this.selectArray[index]
        this.dataArray.push({
          direction: 2,
            id: 2,
          type: 1,
          content: data.content,
          ctime: new Date().toLocaleString()
        })
        let msg = {
          message:data.content,
          receiverId:this.otherId,
          senderId:this.userId,
          typeId:1
        }
        this.sendMsg(msg)
        this.selectShow = false
        this.scrollToBottom()
      },
      initData() {
        this.dataArray = this.data;
        this.scrollToBottom()
      },
      //向上拉刷新
      refresh(done) {
        let me = this;
        if (me.isUpperLaoding) {
          return;
        }
        if (me.isRefreshedAll) {
          done(true);
          me.isUpperLaoding = false;
          return;
        }
        try {
          this.getUpperData().then(function (data) {
            if (data.length === 0) {
              me.isRefreshedAll = true;
              done(true);
            } else {
              me.dataArray = data.reverse().concat(me.dataArray); //倒序合并
              done();
            }
          })
        } catch (error) {
          console.error('wxChat: props "getUpperData" must return a promise object!')
        }
        me.isUpperLaoding = false;
      },
      //向下拉加载
      infinite(done) {
      },
    }
  }
</script>
<style lang="less" scoped>
  @import "myChat";
</style>
