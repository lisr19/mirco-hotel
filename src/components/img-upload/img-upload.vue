<template>
  <div>
    <div class="demo-upload-list" v-for="(item,index) in uploadList">
      <template v-if="item.status === 'finished'">
        <img :src="item.url">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item,index)"></Icon>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <Upload
      v-show="uploadList.length<5"
      ref="upload"
      :show-upload-list="false"
      :on-success="handleSuccess"
      :format="['jpg','jpeg','png']"
      :max-size="10240"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :headers="myHeader"
      type="drag"
      name="imgFile"
      action="http://192.168.0.122:9091/upload/img"
      style="display: inline-block;">
      <div style="width: 64px;height:64px;line-height: 64px;">
        <Icon type="ios-camera" size="30"></Icon>
      </div>
    </Upload>
    <Modal title="上传的图片" v-model="visible">
        <img :src="uploadList[0].url" v-if="visible" style="width: 100%" alt=" ">
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'imgUpload',
  data () {
    return {
      myHeader: { authorization: localStorage.getItem('token') },
      imgName: '',
      visible: false,
      uploadList: []
    }
  },
  methods: {
    handleView (name) {
      this.imgName = name
      this.visible = true
    },
    handleRemove (file,index) {
      this.$emit('delImg',index)
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    handleSuccess (res, file) {
      this.$emit('imgUpload', res.data.url)
      file.url = res.data.url
      file.name = '头像'
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '上传的图片格式错误',
        desc: '上传的图片格式不对，只支持jpg,jpeg,png'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '超出上传限制大小',
        desc: '上传的图片最大不能超过10MB'
      })
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 5
      if (!check) {
        this.$toast('最多只能上传5张图片')
        // this.$Notice.warning({
        //   title: '最多只能上传5张.'
        // })
      }
      return check
    },
    // 更新图片信息
    updateImgUrl (params) {
      this.$refs.upload.fileList = params
      this.uploadList = this.$refs.upload.fileList
    }
  },
  mounted () {
    this.uploadList = this.$refs.upload.fileList
  }
}
</script>
<style>
  .ivu-modal-wrap{
    top:10%
  }
  .demo-upload-list{
    display: inline-block;
    width:118px;
    height:118px;
    text-align: center;
    line-height: 118px;
    border:2px solid rgba(151,151,151,1);
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    margin-right: 24px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 32px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
