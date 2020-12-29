<template>
  <div class="buy-container">
    <nav-bar
      titleText="明丽肴"
      background="#01479E"
      :titleImg="'/static/imgs/no-data.png'"
      :iconHeight="24"
      :iconWidth="102"
      :iconShow="false"
    ></nav-bar>
    <div class="buy-main">
      <div class="buy-banner buy-base-card">
        <img :src="'/static/imgs/no-data.png'" alt="" />
      </div>
      <div class="buy-base-title">
        <p>经销商</p>
        <p @click="changeShop">
          查看全部<span><img :src="'/static/imgs/no-data.png'" alt="" /></span>
        </p>
      </div>
      <div class="buy-base-card buy-shop">
        <div class="buy-shop-shopName">
          <p class="ellipsis">{{ shopInfo.shopName }}</p>
          <p class="ellipsis2">{{ shopInfo.address }}</p>
          <p>
            <span class="shop-line">直销</span>
            <span v-if="isShowDis">{{ userLocal.distance | transRice }}</span>
            <span>离我最近</span>
          </p>
        </div>
        <div class="buy-shop-road">
          <p @click="callShop">
            <img :src="'/static/imgs/no-data.png'" alt="" />
            <span>联系商家</span>
          </p>
          <p @click="goShop">
            <img :src="'/static/imgs/no-data.png'" alt="" />
            <span>导航</span>
          </p>
        </div>
      </div>
      <div class="buy-base-card buy-map">
        <map
          style="width: 100%; height: 590rpx"
          :latitude="latitude"
          :longitude="longitude"
          :markers="covers"
        ></map>
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
  onShareAppMessage(res) {
    return this.$shareOpt;
  },
  data() {
    return {
      isShowDis: false,
      shopInfo: shopList[0],
      shopId: 1,
      shopPhone: "021-52680717",
      latitude: 31.35391,
      longitude: 121.446884,
      covers: [
        {
          latitude: 31.35391,
          longitude: 121.446884,
          iconPath: "/static/imgs/no-data.png",
        },
      ],
      userLocal: {
        latitude: 0,
        longitude: 0,
        distance: 0,
      },
    };
  },
  methods: {
    callShop() {
      wx.makePhoneCall({
        phoneNumber: "02152680717",
      });
    },
    goShop() {
      uni.openLocation({
        latitude: this.latitude,
        longitude: this.longitude,
        success: function () {
          console.log("success");
        },
      });
    },
    changeShop() {
      this.goto(this.AppUrls.SUPLIST);
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
      qqmapsdk.calculateDistance({
        mode: "straight", //可选值：'driving'（驾车）、'walking'（步行 默认），'straight'（直线）
        from: {
          latitude: this.userLocal.latitude,
          longitude: this.userLocal.longitude,
        },
        to: [
          {
            latitude: 31.35391,
            longitude: 121.446884,
          },
        ],
        success: (res) => {
          //距离
          this.userLocal.distance = res.result.elements["0"].distance;
        },
      });
    },
  },
  onLoad() {
    this.getShopRange();
    this.getUserLocal();
  },
};
</script>

<style lang="less">
@import url("../../styles/base.less");
.buy-container {
  .buy-main {
    padding: 24upx;
    .buy-base-title {
      display: flex;
      justify-content: space-between;
      height: 42upx;
      line-height: 42upx;
      margin-top: 40upx;
      p:first-child {
        font-size: 30upx;
        font-weight: 600;
        color: @gray_black;
      }
      p:last-child {
        color: #999;
        font-size: 22upx;
        display: flex;
        align-items: center;
      }
      img {
        width: 24upx;
        height: 24upx;
        margin-left: 4upx;
        position: relative;
        top: 4upx;
      }
    }
    .buy-base-card {
      width: 702upx;
      height: 260upx;
      border-radius: 16upx;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .buy-shop {
      background-color: #fff;
      height: 186upx;
      margin-top: 24upx;
      padding: 24upx;
      display: flex;
      justify-content: space-between;
    }
    .buy-shop-shopName {
      width: 496upx;
      p:first-child {
        color: #333;
        font-size: 32upx;
        line-height: 40upx;
        font-weight: 600;
      }
      p:nth-child(2) {
        color: #666;
        font-size: 24upx;
        line-height: 30upx;
        padding-right: 40upx;
        font-weight: 400;
        margin-top: 8upx;
        margin-bottom: 8upx;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
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
    .buy-shop-road {
      width: 210upx;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      & > p {
        display: flex;
        flex-direction: column;
        flex: 1;
        justify-content: flex-start;
        align-items: center;
        span {
          color: #666;
          font-size: 20upx;
          line-height: 28upx;
          margin-top: 8upx;
        }
      }
      img {
        width: 48upx;
        height: 48upx;
      }
    }
    .buy-map {
      height: 590upx;
      margin-top: 24upx;
    }
  }
}
</style>