<template>
  <scroll-view
    scroll-y
    style="height: 100%"
    :lowerThreshold="300"
    scroll-with-animation
    enable-back-to-top
    @scrolltolower="loadMore"
  >
    <div
      class="goods-item"
      :class="item.swiper && 'swiper'"
      v-for="(item, i) in list"
      :key="item.id"
      @touchstart="touchStart($event)"
      @touchmove="touchMove($event, i)"
      @touchend="touchEnd($event, i)"
    >
      <img
        class="goods-img"
        :src="item.imgUrl"
        mode="aspectFill"
        @click="goDetail(item)"
      />
      <div class="goods-info" :class="border && 'border'">
        <div class="tit" @click="goDetail(item)">
          {{ item.brandName }} {{ item.productName }}
        </div>
        <div class="spec">{{ item.spec || "" }}</div>
        <div class="spec">
          <i v-if="item.isNew" class="iconfont iconxinpin is-new"></i>
          <span v-if="item.giftIcon" class="manzengIcon">{{
            item.giftIcon
          }}</span>
        </div>
        <div class="spec">
          <span
            class="yellow"
            v-if="item.availableAmount === null || item.availableAmount <= 0"
            >库存不足</span
          >
          <span
            class="green"
            v-if="item.availableAmount > 0 && item.availableAmount <= 100"
            >库存{{ item.availableAmount }}</span
          >
          <span class="green" v-if="item.availableAmount > 100">库存>100</span>
        </div>
        <div class="price" v-if="item.id !== null">
          <span class="yen">&yen;</span>
          {{ item.salePrice }}
          <span class="unit">/{{ item.goodUint }}</span>
        </div>
        <div class="no-price" v-else>暂未定价</div>

        <div class="count-container count-btn">
          <div
            v-show="item.count > 0"
            class="reduce"
            @click.stop="reduce(item)"
          >
            <i class="iconfont iconjianhao"></i>
          </div>
          <div v-show="item.count > 0" class="value">{{ item.count }}</div>
          <div class="plus" @click.stop="plus(item)">
            <i class="iconfont iconadd-o"></i>
          </div>
        </div>
      </div>
      <div class="hidden-info">
        <span class="tag" :class="!item.goodsTypeStr && 'v-hidden'">{{
          item.goodsTypeStr
        }}</span>
        <span class="price-down">{{ item.priceDown }}</span>
        <span class="price-up">{{ item.priceUp }}</span>
      </div>
    </div>
    <div class="goods-no-data" v-if="list.length == 0 && ajaxed">
      <img
        class="img"
        src="https://shicai56-statics.oss-cn-shanghai.aliyuncs.com/static/mini/img/no-data/goods-empty.png"
      />
      <p class="word">没有相关的商品数据</p>
    </div>
    <addPanel></addPanel>
  </scroll-view>
</template>

<script>
import { GoodsControllerApi } from "@/api/sc.api";
import { downloader, debounce } from "@/utils";
import { mapGetters, mapActions } from "vuex";
import { toFix2 } from "@/filters";

const THRESHOLD = 30; //偏移阈值
var STARTX = 0;
var ENDX = 0;
export default {
  props: {
    apiAjax: {
      type: Function,
      default: function () {
        return GoodsControllerApi.pagedListUsingPOST;
      },
    },
    inParams: {
      type: Object,
      default: function () {
        return {
          keyword: "",
        };
      },
    },
    border: {
      type: Boolean,
      default: false,
    },
    autoLoad: {
      type: Boolean,
      default: true,
    },
    otherInfo: {
      type: Object,
      default: function () {
        return {
          customerId: "",
        };
      },
    },
  },
  data() {
    return {
      list: [],
      params: {
        pageIndex: 1,
        pageSize: 10,
      },
      totalPage: 0,
      ajaxed: false,
      ajaxLoading: false, //用来控制滚动太快重复请求
    };
  },
  computed: {
    ...mapGetters(["getCartList"]),
    canAjax() {
      return this.params.pageIndex < this.totalPage;
    },
    cartList() {
      return this.getCartList
        .filter((item) => !item.gift)
        .map((item) => {
          return item.productId;
        });
    },
  },
  watch: {
    inParams: {
      handler: debounce(function (newVal, oldVal) {
        this.params.pageIndex = 1;
        if (newVal.keywords === "") {
          this.ajaxed = false;
          this.list = [];
        } else {
          this.getList();
        }
      }, 120),
      immediate: true,
    },
  },
  methods: {
    ...mapActions(["addCart", "updateCartItemNum", "setAddPanelData"]),
    reduce(item) {
      item.count--;
      if (item.count <= 0) {
        item.count = 0;
      }
      item.count = Math.round(item.count * 100) / 100;
      let itemData = this.clearData(item);
      this.updateCartItemNum(itemData);
    },
    plus(item) {
      // 如果有零售，就弹出选择单位面板
      if (item.resaleFlag && item.count === 0) {
        this.setAddPanelData(item);
      } else {
        item.count++;
        // 添加商品到购物车
        this.addCart({
          customerId: this.otherInfo.customerId,
          productId: item.productId,
          goodsId: item.id,
          brandName: item.brandName,
          productName: item.productName,
          spec: item.spec,
          priceDown: item.priceDown,
          priceUp: item.priceUp,
          goodsTypeStr: item.goodsTypeStr,
          salePrice: item.salePrice,
          floorPrice: item.floorPrice,
          calculateUnit: item.calculateUnit,
          resaleCalculateUnit: item.resaleCalculateUnit,
          giftIcon: item.giftIcon, //是否在打折中
          isResale: false, //是否零售
          gift: false,
          sample: false, // 是否样品默认为false
        });
      }
    },

    goDetail(item) {
      this.goto(
        `${this.AppUrls.SHOP_MALL_DETAIL}?productId=${item.productId}&goodsId=${item.id}`
      );
    },
    getList() {
      if (!this.inParams.customerId) return;
      let vo = {
        ...this.params,
        ...this.inParams,
      };

      this.ajaxLoading = true;
      this.apiAjax({
        vo,
      }).then(({ body }) => {
        if (body.success) {
          this.ajaxed = true;
          let list = body.rows.map((item) => {
            item.swiper = false;
            item.goodsTypeStr =
              item.goodsType !== null
                ? this.Enumstr(item.goodsType, "GoodsType")
                : "";
            item.priceDown = item.priceDown === null ? "" : item.priceDown;
            item.priceUp = item.priceUp === 0 ? 0 : `+${item.priceUp}`;
            item.goodUint = this.Enumstr(
              item.calculateUnit,
              "CalculateUnitEnum"
            );
            item.imgUrl =
              !item.picUrl || !item.picUrl.trim()
                ? "https://shicai56-statics.oss-cn-shanghai.aliyuncs.com/static/mini/img/no-data/no-img200.png"
                : downloader.getFileUrl({
                    fileKey: item.picUrl,
                    styleName: "128",
                  });
            item.availableAmount = toFix2(item.availableAmount);
            // 根据Stroe去设置数量
            let storeIndex = this.getCartList.findIndex(
              (el) => el.goodsId == item.id
            );
            item.count =
              storeIndex > -1 ? this.getCartList[storeIndex].saleNum : 0;
            // item.count = 0;
            return item;
          });
          if (this.params.pageIndex > 1) {
            this.list.push(...list);
          } else {
            this.list = list;
          }
          this.totalPage = Math.ceil(body.total / this.params.pageSize);
        }
        this.ajaxLoading = false;
      });
    },
    loadMore() {
      if (!this.canAjax || this.ajaxLoading) return;
      this.params.pageIndex++;
      this.getList();
    },
    // 滑动开始
    touchStart(e) {
      // 获取移动距离，可以通过打印出e，然后分析e的值得出
      STARTX = e.mp.changedTouches[0].clientX;
    },
    touchMove(e, index) {
      if (this.list[index].swiper) return;
      ENDX = e.mp.changedTouches[0].clientX;
      if (STARTX - ENDX < -THRESHOLD) {
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].swiper = false;
        }
        this.list[index].swiper = true;
      }
    },
    // 滑动结束
    touchEnd(e, index) {
      this.recover(index);
    },
    // 点击回复原状
    recover(index) {
      this.list[index].swiper = false;
    },
    //同步购物车和列表中的数量
    syncCartCount() {
      setTimeout(() => {
        this.list.forEach((item, i) => {
          let index = this.getCartList.findIndex((el) => el.goodsId == item.id);
          this.list[i].count = index > -1 ? this.getCartList[index].saleNum : 0;
        });
      }, 200);
    },
  },
};
</script>

<style lang="less">
@import url("../../styles/base.less");
.goods-item {
  position: relative;
  display: flex;
  transition: transform 0.1s;
  transform: translate3d(0, 0, 0);
  padding: 8px 0;
  &.swiper {
    transform: translate3d(48px, 0, 0);
  }
  .hidden-info {
    position: absolute;
    width: 36px;
    height: 100%;
    padding: 10px 4px;
    left: -48px;
    top: 0;
    text-align: right;
    .tag {
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      font-size: 12px;
      font-weight: 400;
      color: @font_c;
      background-color: @gry_border;
      border-radius: 2px;
      &.v-hidden {
        visibility: hidden;
      }
    }
    .price-down,
    .price-up {
      display: block;
      font-size: 12px;
      font-weight: 400;
      margin-top: 4px;
    }
    .price-down {
      color: @base_green;
    }
    .price-up {
      color: @base_red;
    }
  }
  .goods-img {
    display: block;
    width: 80px;
    height: 80px;
    border-radius: 4px;
  }
  .goods-info {
    position: relative;
    flex: 1;
    padding: 0 12px;
    height: 100%;
    &.border:after {
      content: "";
      position: absolute;
      width: 100%;
      height: 1px;
      background-color: @gry_border;
      left: 12px;
      bottom: -1px;
    }
    .tit {
      width: 100%;
      font-size: 14px;
      color: @base_black;
      font-weight: 400;
      height: 20px;
      line-height: 20px;
      overflow: hidden;
      width: 170px;
      .ellipsis;
    }
    .spec {
      width: 170px;
      font-size: 11px;
      color: @light_gray;
      height: 20px;
      line-height: 20px;
      margin-top: 4px;
      .ellipsis;
      .yellow {
        color: @base_yellow;
      }
      .green {
        color: @base_green;
      }
    }
    .is-new {
      font-size: 14px;
      color: @base_red;
      margin-right: 4px;
      vertical-align: middle;
    }
    .price,
    .no-price {
      margin-top: 4px;
      height: 20px;
      line-height: 20px;
      font-size: 17px;
      font-weight: 600;
    }
    .price {
      color: @base_red;
    }
    .no-price {
      font-weight: 500;
      color: @font_c;
    }
    .yen {
      font-size: 10px;
      color: @base_red;
    }
    .unit {
      font-size: 11px;
      color: @light_gray;
      font-weight: 400;
    }
    .count-btn {
      position: absolute;
      right: 12px;
      bottom: 0;
    }
    .count-container {
      display: flex;
      .reduce,
      .plus {
        width: 20px;
        height: 20px;
      }
      .value {
        min-width: 36px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        font-size: 16px;
        padding: 0 4px;
        color: @base_black;
      }
      .iconfont {
        color: @base_red;
        font-size: 20px;
      }
    }
  }
  .manzengIcon {
    font-size: 18rpx;
    color: #eb3d3d;
    margin-right: 4rpx;
    vertical-align: middle;
    height: 24rpx;
    line-height: 24rpx;
    padding: 0 10rpx;
    margin-left: 6rpx;
    border-radius: 22rpx;
    border: 1px solid #eb3d3d;
    position: relative;
    top: -1rpx;
  }
}

.goods-no-data {
  width: 100%;
  .img {
    display: block;
    width: 141px;
    height: 165px;
    margin: 100px auto 0;
  }
  .word {
    text-align: center;
    font-size: 14px;
    color: @light_gray;
    margin-top: 24px;
  }
}
</style>
