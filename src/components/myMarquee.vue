<template>
  <div class="marquee-container">
    <div class="inner" :style="{ left: positionLeft + 'rpx' }">
      {{ innerText }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    innerText: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      positionLeft: 200,
      timerId: "",
    };
  },
  methods: {
    startAnimation() {
      this.timerId = setInterval(() => {
        if (this.positionLeft < -500) {
          return (this.positionLeft = 200);
        } else {
          return (this.positionLeft -= 1);
        }
      }, 16);
    },
    start() {
      this.positionLeft = 200;
      this.startAnimation();
    },
    end() {
      clearInterval(this.timerId);
    },
  },
  onReady() {},
};
</script>

<style lang='less'>
.marquee-container {
  position: relative;
  white-space: nowrap;
  .inner {
    position: relative;
  }
}
</style>