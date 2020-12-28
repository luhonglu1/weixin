<template>
  <div class="index-container">
    <nav-bar :iconShow="false" titleText="厂销宝"></nav-bar>

    <i-toast id="toast" />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang="less">
@import url("../../styles/base.less");
page {
  background-color: #fff;
}

.index-container {
}
</style>
