<script>
// import { FUNDEBUG_APPID } from "@/utils/consts";
// import fundebug from "fundebug-wxjs";

export default {
  methods: {
    autoUpdate() {
      console.log(123);
      const updateManager = uni.getUpdateManager();
      updateManager.onCheckForUpdate(({ hasUpdate }) => {
        if (hasUpdate) {
          uni.showModal({
            title: "更新提示",
            content: "有新版本请更新",
            success: (res) => {
              if (res.confirm) {
                updateManager.onUpdateReady(() => {
                  updateManager.applyUpdate();
                });
              } else if (res.cancel) {
                this.autoUpdate();
              }
            },
          });
          updateManager.onUpdateFailed(() => {
            // 新的版本下载失败
            uni.showModal({
              title: "更新提示",
              content: "新版本下载失败，请清除缓存后重试",
              success: (res) => {
                this.autoUpdate();
              },
            });
          });
        }
      });
    },
  },
  async onLaunch() {
    // 初始化fundebug
    // fundebug.init({
    //   apikey: FUNDEBUG_APPID,
    // });
  },
  onShow() {
    this.autoUpdate();
  },
  onError(msg) {
    // if (env !== "pro") return;
    //上报错误
    // fundebug.notifyError(msg);
  },
  async mounted() {
    //把机器的头部高度存下来
    let sysinfo = wx.getSystemInfoSync();
    let navHeight = sysinfo.system.includes("iOS")
      ? 44 + sysinfo.statusBarHeight
      : 48 + sysinfo.statusBarHeight;
    wx.setStorageSync("navHeight", navHeight);
    wx.setStorageSync("windowHeight", sysinfo.windowHeight);
  },
};
</script>

<style lang="less">
@import url("./styles/common.less");
</style>
