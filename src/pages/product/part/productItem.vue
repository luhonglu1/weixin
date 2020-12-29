<template>
  <div class="product-item">
    <div class="pro-img">
      <img :src="item.imgUrl" alt="" />
    </div>
    <div class="pro-info">
      <div class="pro-desc">{{ item.desc }}</div>
      <div class="pro-spec">{{ item.spec }}</div>
      <div class="pro-icon">
        <span class="pro-icon-item" v-for="icon in item.keys" :key="icon">{{
          icon
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      default: () => {},
      type: Object,
    },
  },
  onReady() {},
};
</script>

<style lang="less">
@import url("../../../styles/base.less");
.product-item {
  width: 100%;
  position: relative;
  padding-top: 24upx;
  .pro-img {
    width: 100%;
    height: 342upx;
    border-radius: 8upx;
    overflow: hidden;
    img {
      display: block;
      height: 100%;
      width: 100%;
    }
  }
  .pro-info {
    width: 100%;
    padding-top: 16upx;
    .pro-desc {
      width: 100%;
      height: 42upx;
      font-size: 30upx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 42upx;
      .ellipsis();
    }
    .pro-spec {
      width: 100%;
      margin-top: 8upx;
      height: 30upx;
      font-size: 22upx;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #999999;
      line-height: 30upx;
      .ellipsis();
    }
    .pro-icon {
      width: 100%;
      margin-top: 8upx;
      height: 50upx;
      padding-top: 2upx;
      .ellipsis();
      .pro-icon-item {
        height: 30upx;
        line-height: 30upx;
        border-radius: 4upx;
        border: 1upx solid #01479e;
        color: #01479e;
        margin: 0 8upx;
        padding: 0 8upx;
      }
    }
  }
}
</style>