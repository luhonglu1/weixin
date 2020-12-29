<template>
  <div class="product-detail">
    <nav-bar
      :white="true"
      titleText="商品详情"
      background="#01479E"
      color="#fff"
    ></nav-bar>
    <template v-if="detail.id">
      <div class="product-img"><img :src="detail.imgUrl" alt="" /></div>
      <div class="info">
        <div class="pro-desc">{{ detail.desc }}</div>
        <div class="pro-spec">{{ detail.spec }}</div>
        <div class="pro-icon">
          <span class="pro-icon-item" v-for="icon in detail.keys" :key="icon">{{
            icon
          }}</span>
        </div>
      </div>

      <div class="detail-style">
        <titleLine titleStr="商品详情" :height="110"></titleLine>
        <div class="detail-content">
          <image
            class="img"
            mode="widthFix"
            v-for="item1 in detail.detailUrls"
            :key="item1"
            :src="item1"
            alt=""
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { productList } from "@/static/data/product";
import parser from "@/components/jyf-parser/jyf-parser";
import titleLine from "@/components/titleLine";

export default {
  components: {
    parser,
    titleLine,
  },
  data() {
    return {
      id: "",
      detail: {},
      list: [1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1],
    };
  },
  methods: {
    getDetail() {
      this.detail = productList.find((item) => item.id == this.id) || {};
    },
  },
  onShow() {
    this.id = this.$mp.query.id;
    console.log(this.id, "产品id");
    this.getDetail();
  },
};
</script>

<style lang="less">
@import url("../../styles/mixin.less");
.ql-container {
  height: auto;
  min-height: 0;
}
.product-detail {
  background-color: #fff;
  min-height: 100vh;
  .product-img {
    width: 100%;
    height: 750upx;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .info {
    width: 100%;
    padding: 24upx;
    border-bottom: 20upx solid #f5f5f5;
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
        margin: 0 8upx 0 0;
        padding: 0 8upx;
      }
    }
  }
  .detail-style {
    padding: 0 24upx 24upx;
    .detail-content {
      width: 100%;
      .img {
        display: block;
        width: 100%;
        margin-bottom: 24upx;
      }
    }
  }
}
</style>