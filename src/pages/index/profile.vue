<template>
  <div class="profile-container">
    <nav-bar
      :white="true"
      titleText="公司介绍"
      background="#01479E"
      color="#fff"
    ></nav-bar>
    <div class="content">
      <div class="profile-img">
        <img :src="profileDetail.imgUrl" alt="" />
      </div>
      <div class="article">
        <div class="part" v-for="part in profileDetail.article" :key="part">
          {{ part }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { profile } from "@/static/data/profile";
export default {
  data() {
    return {
      profileDetail: {},
    };
  },
  methods: {
    getDetail() {
      this.profileDetail = profile;
    },
  },
  onShow() {
    this.getDetail();
  },
};
</script>

<style lang="less">
.profile-container {
  background-color: #fff;
  min-height: 100vh;
  padding: 24upx;
  .content {
    .profile-img {
      width: 100%;
      height: 526upx;
      img {
        display: block;
        height: 100%;
        width: 100%;
      }
    }
    .article {
      margin-top: 19upx;
      font-size: 34upx;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #333333;
      line-height: 60upx;
      .part {
        margin-bottom: 30upx;
      }
    }
  }
}
</style>