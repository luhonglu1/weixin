<template>
  <div class="supList-container">
    <nav-bar titleText="供应商"></nav-bar>
    <div class="supList-main">
      <div class="supList-base-card supList-shop">
        <div
          @click="changeShop"
          v-for="(item, i) in shopList"
          :key="item.shopId"
          :class="[
            'supList-shop-shopName',
            shopId == item.shopId ? 'sup-selected' : ' ',
          ]"
        >
          <p class="ellipsis">{{ item.shopName }}</p>
          <p class="ellipsis">{{ item.address }}</p>
          <p>
            <span class="shop-line">直销</span>
            <span>{{
              (userLocal.distance[0] && userLocal.distance[0].distance)
                | transRice
            }}</span>
            <span>离我最近</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { qqmapsdk } from "@/utils/index";
import { shopList } from "@/static/data/mockData";

export default {
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },
  data() {
    return {
      shopList,
      shopId: 1,
      userLocal: {
        latitude: 0,
        longitude: 0,
        distance: [],
      },
    };
  },
  methods: {
    changeShop() {
      wx.switchTab({ url: this.AppUrls.BUY });
    },
    // 获取用户地址
    getUserLocal() {
      uni.getLocation({
        type: "gcj02", //返回可以用于uni.openLocation的经纬度
        success: (res) => {
          this.isShowDis = true;
          this.userLocal.latitude = res.latitude;
          this.userLocal.longitude = res.longitude;
          this.getShopRange();
        },
        fail: () => {
          this.isShowDis = false;
        },
      });
    },
    // 获取距离店铺多远
    getShopRange() {
      let toList = this.shopList.map((v) => {
        return {
          latitude: v.local.lat,
          longitude: v.local.log,
        };
      });
      console.log(toList, "toList");
      if (toList.length < 1) return;
      qqmapsdk.calculateDistance({
        mode: "straight", //可选值：'driving'（驾车）、'walking'（步行 默认），'straight'（直线）
        from: {
          latitude: this.userLocal.latitude,
          longitude: this.userLocal.longitude,
        },
        to: toList,
        success: (res) => {
          //距离
          // let distance = res.result.elements['0'].distance;
          console.log(res.result.elements, "res.result.elements");
          this.userLocal.distance = res.result.elements;
        },
      });
    },
  },
  onLoad() {
    this.getUserLocal();
  },
};
</script>

<style lang="less">
@import url("../../styles/base.less");
.supList-container {
  .supList-main {
    padding: 24upx;
    .supList-base-card {
      width: 702upx;
      height: 260upx;
      border-radius: 16upx;
      overflow: hidden;
    }
    .supList-shop {
      background-color: #fff;
      height: 186upx;
      padding: 24upx;
      display: flex;
      justify-content: space-between;
    }
    .supList-shop-shopName {
      width: 100%;
      position: relative;
      p:first-child {
        color: #333;
        font-size: 32upx;
        line-height: 40upx;
        font-weight: 600;
      }
      p:nth-child(2) {
        color: #666;
        font-size: 24upx;
        line-height: 34upx;
        font-weight: 400;
        margin-top: 8upx;
        margin-bottom: 8upx;
      }
      p:last-child {
        span {
          border-radius: 4upx;
          height: 32upx;
          color: @base_gray;
          font-size: 20upx;
          line-height: 32upx;
          text-align: center;
          padding: 0 8upx;
          margin-left: 8upx;
          border: 1upx solid @base_gray;
        }
        .span:first-child {
          margin-left: 0;
        }
        .shop-line {
          color: @theme_blue;
          border-color: @theme_blue;
        }
      }
    }
    .sup-selected::after {
      content: "当前选中";
      position: absolute;
      right: -24upx;
      top: -24upx;
      z-index: 99;
      height: 34upx;
      background-color: @theme_blue;
      color: #fff;
      border-bottom-left-radius: 17upx;
      font-size: 18upx;
      line-height: 34upx;
      padding: 0 16upx;
    }
  }
}
</style>