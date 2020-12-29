<template>
  <div class="index-container">
    <nav-bar
      :iconShow="false"
      titleText=" "
      :white="true"
      color="#fff"
      :background="transparent"
    ></nav-bar>
    <div class="bg-img" :style="{ 'padding-top': navHeight + 'px' }">
      <div
        class="top"
        :style="[{ height: navHeight + 'px' }, { backgroundColor: mainColor }]"
      ></div>
      <div class="content" :style="{ backgroundColor: mainColor }">
        <img class="img" src="/static/imgs/no-data.png" alt="" />
      </div>
    </div>

    <div
      class="info-content"
      :style="{ paddingTop: 586 - (750 / screenWidth) * navHeight + 'rpx' }"
    >
      <div class="actual-content">
        <div class="factory-card">
          <div class="logo">
            <img src="/static/imgs/no-data.png" alt="" />
          </div>
          <div class="info">
            <div class="name">明丽肴</div>
            <div class="slogen">找优质水产，就选明丽肴</div>
          </div>
        </div>
        <div class="notice">
          <div style="width: 60rpx">公告</div>
          <div class="notice-inner">
            <myMarquee
              ref="myMarquee"
              innerText="明丽肴小程序全新上线，感谢新老顾客一路支持！"
            ></myMarquee>
          </div>
        </div>
        <div class="main-part" @click="goFactory">
          公司介绍
          <div class="icon-img">
            <img src="/static/imgs/index/profile.png" alt="" />
          </div>
        </div>
        <div class="main-part" @click="goStory">
          品牌故事
          <div class="icon-img">
            <img src="/static/imgs/index/story.png" alt="" />
          </div>
        </div>
      </div>
    </div>

    <i-toast id="toast" />
  </div>
</template>

<script>
import myMarquee from "@/components/myMarquee";

export default {
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },
  components: {
    myMarquee,
  },
  onShareAppMessage(res) {
    return this.$shareOpt;
  },
  data() {
    return {
      transparent: "rgba(0,0,0,0)",
      navHeight: 0,
      mainColor: "#01479E",
      screenWidth: 0,
    };
  },
  methods: {
    goFactory() {
      this.goto(`${this.AppUrls.INDEX_PROFILE}`);
    },
    goStory() {
      this.showToastTitle("该内容正在维护中！");
    },
  },
  onReady() {
    this.navHeight = wx.getStorageSync("navHeight");
    this.screenWidth = wx.getStorageSync("screenWidth");
  },
  onShow() {
    this.$refs.myMarquee.start();
  },
  onHide() {
    this.$refs.myMarquee.end();
  },
};
</script>

<style lang="less">
@import url("../../styles/base.less");
page {
  background-color: #f5f5f5;
}

.index-container {
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
  .bg-img {
    position: absolute;
    top: 0;
    left: 0;
    height: 586upx;
    width: 100%;
    .top {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 298;
    }
    .content {
      height: 100%;
      width: 100%;
      .img {
        width: 678upx;
        height: 480upx;
        position: absolute;
        top: 128upx;
        left: 39upx;
      }
    }
    .bgc-white {
      width: 100%;
      height: 420rpx;
      background-color: #fff;
      z-index: -1;
    }
  }
  .info-content {
    padding: 0 24upx;
    .actual-content {
      position: relative;
      padding-top: 105upx;
      .factory-card {
        position: absolute;
        width: 702upx;
        height: 160upx;
        background: #ffffff;
        box-shadow: 0 2upx 20upx 0 rgba(0, 0, 0, 0.15);
        border-radius: 8upx;
        top: -79upx;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        .logo {
          position: absolute;
          top: 26upx;
          left: 40upx;
          width: 108upx;
          height: 108upx;
          border-radius: 54upx;
          box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.15);
        }
        .name {
          position: absolute;
          top: 30upx;
          left: 172upx;
          width: 500upx;
          height: 56rpx;
          font-size: 40upx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #000000;
          line-height: 56rpx;
          .ellipsis();
        }
        .slogen {
          position: absolute;
          top: 90upx;
          left: 172upx;
          width: 500upx;
          height: 40upx;
          font-size: 28upx;
          font-family: PingFangSC-Semibold, PingFang SC;
          color: #000000;
          line-height: 40upx;
          .ellipsis();
        }
      }
      .notice {
        width: 100%;
        background: #ffffff;
        border-radius: 8upx;
        padding-left: 29upx;
        height: 72upx;
        line-height: 72upx;
        display: flex;
        .notice-inner {
          margin-left: 20upx;
          width: 500upx;
          .ellipsis();
        }
      }
      .main-part {
        margin-top: 24upx;
        width: 100%;
        border-radius: 8upx;
        background: #fff;
        padding-left: 47upx;
        height: 200upx;
        line-height: 200upx;
        font-size: 44upx;
        box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);
        position: relative;
        .icon-img {
          position: absolute;
          top: 50%;
          right: 56upx;
          transform: translateY(-50%);
          height: 109upx;
          width: 160upx;
          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
