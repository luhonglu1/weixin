<template>
  <div class="cooperation-container">
    <nav-bar
      background="#01479E"
      :titleImg="'/static/imgs/no-data.png'"
      :iconHeight="24"
      :iconWidth="102"
      :iconShow="false"
    ></nav-bar>
    <div class="cooperation-main">
      <div class="cooperation-banner">
        <img :src="'/static/imgs/no-data.png'" alt="" />
      </div>
      <div class="cooperation-base-card cooperation-shop">
        <div class="cooperation-shop-shopName">
          <p class="ellipsis">明丽肴水产有限公司</p>
          <p class="ellipsis" @click="callShop">
            <span>商务热线：</span
            ><span style="color: #01479e">021-52680717</span>
          </p>
          <p class="ellipsis callBox" @click="goShop">
            <span>联系地址：</span>
            <span class="callPhone">
              <span>上海市宝山区泰和路1700号江阳市场</span>
              <img :src="'/static/imgs/no-data.png'" alt="" />
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },
  onShareAppMessage(res) {
    return this.$shareOpt;
  },
  data() {
    return {};
  },
  methods: {
    callShop() {
      wx.makePhoneCall({
        phoneNumber: "02152680717",
      });
    },
    goShop() {
      uni.openLocation({
        latitude: 31.35391,
        longitude: 121.446884,
        success: function () {
          console.log("success");
        },
      });
    },
  },
};
</script>

<style lang="less">
.cooperation-main {
  padding: 24upx;
  .cooperation-base-card {
    padding: 24upx;
    width: 702upx;
    height: 214upx;
    border-radius: 16upx;
    background-color: #fff;
    margin-top: 24upx;
    overflow: hidden;
  }
  .cooperation-banner {
    height: 395upx;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .cooperation-shop-shopName {
    width: 100%;
    p {
      color: #333;
      font-size: 28upx;
      line-height: 40upx;
      font-weight: 400;
      margin-bottom: 8upx;
    }
    p:first-child {
      color: #333;
      font-size: 32upx;
      line-height: 40upx;
      font-weight: 600;
      margin-bottom: 16upx;
    }
  }
  .callBox {
    display: flex;
  }
  .callPhone {
    width: 600upx;
    display: flex;
    justify-content: space-between;
    img {
      width: 24upx;
      height: 24upx;
      margin-left: 4upx;
      position: relative;
      top: 6upx;
    }
  }
}
</style>