import Vue from "vue";
import App from "@/App";
import store from "@/store";
import { goto, goback } from "./utils/index";
import { AppUrls } from "./utils/consts";
import { AppEnums, Enumstr } from "./filters/index";
import * as filters from "./filters/index";

import "./styles/iconfont.css";
import ivewBase from "./wxcomponents/iview/base/index";

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

// 获取字典树中的type

Vue.config.productionTip = false;
Vue.prototype.$Toast = ivewBase.$Toast;
Vue.prototype.$Message = ivewBase.$Message;
Vue.prototype.goto = goto; //页面跳转
Vue.prototype.goback = goback;
Vue.prototype.AppUrls = AppUrls; //页面路径管理
Vue.prototype.AppEnums = AppEnums;
Vue.prototype.Enumstr = Enumstr;
Vue.prototype.clearData = (obj) => JSON.parse(JSON.stringify(obj));
Vue.prototype.$store = store;

//提示框
Vue.prototype.showToast = (opt) => {
  wx.showToast(opt);
};

//提示框
Vue.prototype.showToastTitle = (title, icon = "none") => {
  wx.showToast({ title, icon, duration: 3000 });
};

//动态改变页面标题
Vue.prototype.$setTitle = (title) => {
  wx.setNavigationBarTitle({ title });
};

const app = new Vue({
  mpType: "app",
  store,
  ...App,
});
app.$mount();
