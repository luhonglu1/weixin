<template>
  <i class="location iconfont icondingwei11" @click="goGetLocation"></i>
</template>


<script>
import { qqmapsdk, getWxAuth } from "@/utils/index";
export default {
  props: {
    autoChoose: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      longitudeVo: {
        latitude: 0,
        longitude: 0
      }
    };
  },
  methods: {
    goGetLocation() {
      // 获取用户是否开启地理位置权限
      getWxAuth(
        this,
        "userLocation",
        "检测到您没打开定位权限，是否去设置打开？",
        this.getLocaition
      );
    },

    getLocaition(that) {
      wx.chooseLocation({
        success: res => {
          this.qqmapRever(res);
        }
      });
    },

    //自动定位
    autoLocation() {
      wx.getLocation({
        type: "gcj02",
        success: res => {
          this.qqmapRever(res);
          this.longitudeVo = {
            latitude: res.latitude,
            longitude: res.longitude
          };
        },
        fail: er => {
          console.log(er);
        }
      });
    },
    qqmapRever(res) {
      // 调用接口转换成具体位置
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: res.latitude,
          longitude: res.longitude
        },
        success: data => {
          let { name, address, latitude, longitude } = res;
          this.longitudeVo.latitude = latitude;
          this.longitudeVo.longitude = longitude;
          let address_component = data.result.address_component;
          let alandmark_l2 = data.result.address_reference.landmark_l2;
          address = `${alandmark_l2.title ? alandmark_l2.title + " " : ""}${
            address_component.street_number
          }`;
          this.emitData(name, address, data, address_component);
        },
        fail: err => {
          console.log(err);
        }
      });
    },
    emitData(name, address, data, address_component) {
      // let splitStr = data.result.ad_info.district;
      let result = address;
      let code = data.result.ad_info.adcode;
      let provinceCode = code.substr(0, 2) + "0000";
      let cityCode = code.substr(0, 4) + "00";
      let districtCode = code.substr(0, 6);
      if (result == "") return;
      this.$emit("onChoose", {
        address: address,
        code: data.result.ad_info.adcode,
        province: address_component.province,
        provinceCode: provinceCode,
        city: address_component.city,
        cityCode: cityCode,
        district: address_component.district,
        districtCode: districtCode,
        longitudeVo: this.longitudeVo
      });
    }
  }
};
</script>

<style lang="less">
@import url("../styles/base.less");
.location.icondingwei11 {
  color: #e11e1e;
  font-size: 44rpx;
}
</style>


