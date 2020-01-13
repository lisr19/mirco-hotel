<template>
  <div class="main">
    <head-bar :title="pageTitle"></head-bar>
    <div class="write">
      <textarea v-model.trim="content" :maxlength="maxlength" placeholder="开始输入..."></textarea>
      <p v-if="showTips">还可以输入{{maxlength - content.length}}字</p>
      <Button class="btn" type="primary" @click="save">确定</Button>
    </div>
  </div>
</template>

<script>
  import headBar from '@/components/header/head-bar'

  export default {
    name: "write",
    components:{
      headBar,
    },
    data() {
      return {
        reg:null,
        thisType:'',
        showTips: false, // 还可输入剩余字数
        pageTitle: '', // 页面标题
        content: '', // 输入的文本
        maxlength: 1000, // 文本长度限制
      }
    },
    // created(){
    //   this.reg=null;
    //   this.thisType = this.$route.params.pageTitle;
    // },
    activated() {
      this.rp = this.$route.params
      if (this.rp) {
        this.pageTitle = this.rp.pageTitle
        this.content = this.rp.oldText || ''
      }
    },
    methods:{
      save(){
        if(this.pageTitle=='姓名'||this.pageTitle=='紧急联系人'){
          this.reg =/(^[\u4e00-\u9fa5 ]{2,20}$|^[a-zA-Z\/ ]{2,20}$)/
        }else if(this.pageTitle=='电子邮件'){
          this.reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
        }else if(this.pageTitle=='电话'||this.pageTitle=='紧急联系人电话'){;
          this.reg = /^1[0-9]{10}$/;
        }else if(this.pageTitle=='身份证'){
          this.reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        }
        if(this.content.match(this.reg)){
          let params = {text: this.content}
          this.rp.callback && this.rp.callback(params)
          this.reg=null;
          this.$router.back();//返回上一层
        }else{
          if(this.pageTitle=='姓名'){
            this.$toast('请输入正确的姓名')
          }else if(this.pageTitle=='电子邮件'){
            this.$toast('请输入正确的电子邮件')
          }else if(this.pageTitle=='电话'){
            this.$toast('请输入正确的电话号码')
          }else if(this.pageTitle=='身份证'){
            this.$toast('请输入正确的身份证')
          }else if(this.pageTitle=='紧急联系人'){
            this.$toast('请输入正确的紧急联系人')
          }else if(this.pageTitle=='紧急联系人电话'){
            this.$toast('请输入正确的紧急联系人电话')
          }
        }

      },
    },
  }
</script>


<style lang="less" scoped>
  .main{
    background-color: #f1f1f1;
    height: 100%;
    padding-top: 100px;
  }
  .write {
    padding: 36px;
    text-align: right;
    textarea{
      width: 100%;
      height: 350px;
      border: none;
      font-size: 30px;
      box-sizing: border-box;
      vertical-align: top;
      border-radius: 10px;
      padding: 15px;
    }
    .btn{
      width: 100%;
      height: 68px;
      margin: 60px 0;
      font-size: 28px;
      border-radius: 8px;
    }
  }
</style>
