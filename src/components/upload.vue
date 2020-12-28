<template>
  <div class="img-upload-container">
    <div class="view-img" v-for="(img,i) in uploads" :key="i" @click="viewImg(img)">
      <i class="iconfont icondel" @click.stop="delImg(i)"></i>
      <img class="img" :src="img" />
    </div>
    <div class="action-item" @click="chooseType">
      <i class="iconfont iconxingzhuang"></i>
      <p class="txt">上传资料</p>
    </div>

    <i-action-sheet
      :visible="show"
      :actions="actions"
      show-cancel
      @onClick="asClick"
      @onCancel="onCancel"
    />
    <i-message id="message" />
    <i-modal title="删除确认" :visible="delShow" :actions="delActions" @onClick="onModalClick">
      <view>删除后无法恢复哦</view>
    </i-modal>
    <i-toast id="toast" />
  </div>
</template>

<script>
import { uploader, downloader } from "@/utils/index";

export default {
  data() {
    return {
      show: false,
      delShow: false,
      delIndex: NaN,
      fileType: 0,
      actions: [
        {
          name: "上传门店照片"
        },
        {
          name: "上传营业执照"
        },
        {
          name: "上传开票资料"
        }
      ],
      delActions: [
        {
          name: "取消"
        },
        {
          name: "删除",
          color: "#ed3f14",
          loading: false
        }
      ],
      uploads: []
    };
  },
  methods: {
    chooseType() {
      this.show = true;
    },
    asClick(e) {
      this.fileType = e.mp.detail.index;
      this.show = false;
      this.chooseImage();
    },
    onCancel() {
      this.show = false;
    },
    chooseImage(e) {
      wx.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"], //可选择原图或压缩后的图片
        sourceType: ["album", "camera"], //可选择性开放访问相册、相机
        success: async res => {
          const MAX_SIZE = 1 * 1024 * 1024; //最大限制2MB
          this.$Toast({
            content: "图片上传中",
            type: "loading",
            duration: 0
          });
          let file = res.tempFiles[0];
          let size = file.size;
          let path = file.path;
          let result = await uploader.upload(path, "addCustomerFile", {
            accessLevel: "PublicRead"
          });
          let { rows } = await downloader.download([result.data.fileKey]);
          this.uploads.push(rows[0].url);
          // this.uploads.push(downloader.getFileUrl({ fileKey: result.data.fileKey, styleName: '128' }));
          this.$emit("onUpload", {
            fileName: result.data.fileName,
            fileKey: result.data.fileKey,
            fileType: this.fileType
          });
          this.$Toast.hide();
        }
      });
    },
    viewImg(img) {
      wx.previewImage({
        current: img, //当前预览的图片
        urls: this.uploads //所有要预览的图片
      });
    },
    delImg(index) {
      this.delIndex = index;
      this.delShow = true;
    },
    onModalClick(e) {
      if (e.mp.detail.index === 0) {
        this.delIndex = NaN;
        this.delShow = false;
      } else {
        this.delActions[1].loading = true;
        setTimeout(() => {
          this.uploads.splice(this.delIndex, 1);
          this.$emit("onDel", this.delIndex);
          this.delActions[1].loading = false;
          this.delShow = false;
          this.$Toast({
            content: "删除成功！",
            type: "success"
          });
        }, 1000);
      }
    }
  }
};
</script>


<style lang="less">
@import url("../styles/base.less");
.img-upload-container {
  display: flex;
  flex-wrap: wrap;
  .view-img {
    position: relative;
    width: 100px;
    height: 75px;
    margin: 0 11px 11px 0;
    .borderRadius;
    border: 1px solid @gry_border;
    .img {
      display: block;
      width: 100%;
      height: 100%;
    }
    .iconfont {
      position: absolute;
      left: -5px;
      top: -5px;
      font-size: 22px;
      background: #fff;
      border-radius: 22px;
      color: @base_red;
    }
  }
  .action-item {
    width: 100px;
    height: 75px;
    background: @gry_background;
    .borderRadius;
    border: 1px dashed @gry_border;
    text-align: center;
    padding: 14px 0;
    .iconfont {
      color: @tip_gray;
      font-size: 22px;
    }
    .txt {
      color: @font_c;
      font-size: 13px;
      margin-top: 8px;
    }
  }
}
</style>
