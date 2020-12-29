<template>
  <div class="product-container">
    <nav-bar
      :iconShow="false"
      :titleImg="'/static/imgs/no-data.png'"
      :iconHeight="24"
      :iconWidth="102"
      background="#01479E"
    ></nav-bar>
    <div class="pro-content">
      <div
        class="pro-item"
        v-for="item in list"
        :key="item.id"
        @click="goDetail(item.id)"
      >
        <productItem :item="item"></productItem>
      </div>
    </div>
  </div>
</template>

<script>
import { productItem } from "./part/productItem";
import { productList } from "@/static/data/product";
export default {
  onShareAppMessage(res) {
    return this.$shareOpt;
  },
  components: {
    productItem,
  },
  data() {
    return {
      list: [],
    };
  },
  methods: {
    goDetail(id) {
      this.goto(`${this.AppUrls.PRODUCT_DETAIL}?id=${id}`);
    },
    getList() {
      this.list = productList;
    },
  },
  onShow() {
    console.log("获取数据");
    this.getList();
  },
};
</script>

<style lang="less">
.product-container {
  background-color: #fff;
  height: 100vh;
  .pro-content {
    background-color: #fff;
    overflow: hidden;
    padding: 0 24upx 24upx;
    .pro-item:nth-child(2n-1) {
      margin-right: 16upx;
    }
    .pro-item {
      width: 343upx;
      float: left;
    }
  }
}
</style>