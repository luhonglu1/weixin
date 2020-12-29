<template>
  <div
    class="title-line"
    :style="[{ height: height + 'rpx' }, { lineHeight: height + 'rpx' }]"
  >
    <div class="line-item before" :style="{ height: height + 'rpx' }">
      <div class="line"></div>
    </div>
    <div class="inner" :style="{ height: height + 'rpx' }">{{ titleStr }}</div>
    <div class="line-item after" :style="{ height: height + 'rpx' }">
      <div class="line"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    titleStr: {
      type: String,
      default: "",
    },
    height: {
      type: Number,
      default: 45,
    },
  },
};
</script>

<style lang='less'>
.title-line {
  width: 100%;
  font-size: 32upx;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #333333;
  display: flex;
  .line-item {
    flex: 1;
    position: relative;
  }
  .before {
    .line {
      right: 0;
      &::after {
        right: 0;
      }
    }
  }
  .inner {
    width: 200upx;
    text-align: center;
  }
  .after {
    .line {
      left: 0;
      &::after {
        left: 0;
      }
    }
  }
  .line {
    position: absolute;
    width: 60%;
    height: 2upx;
    background-color: #ddd;
    top: 50%;
    transform: translateY(-50%);
    &::after {
      content: "";
      height: 8upx;
      width: 8upx;
      border-radius: 4upx;
      background-color: #ddd;
      position: absolute;
      top: -3upx;
    }
  }
}
</style>