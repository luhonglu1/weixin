<template>
  <scroll-view
    scroll-y
    :scrollTop="scrollTop"
    @scroll="scroll"
    style="height: 100%"
    :lowerThreshold="300"
    scroll-with-animation
    enable-back-to-top
    @scrolltolower="loadMore"
  >
    <div
      class="product-item"
      :class="item.swiper && 'swiper'"
      @click="goDetail(item)"
      v-for="(item, i) in list"
      :key="item.uuid"
      @touchstart="touchStart($event)"
      @touchmove="touchMove($event, i)"
      @touchend="touchEnd($event, i)"
    >
      <img class="product-img" :src="item.imgUrl" mode="aspectFill" />
      <div class="product-info" :class="border && 'border'">
        <div class="tit">{{ item.brandName }} {{ item.productName }}</div>
        <div class="spec">{{ item.spec || "" }}</div>
        <div class="spec">
          <i v-if="item.isNew" class="iconfont iconxinpin is-new"></i>
          <span v-if="item.giftIcon" class="manzengIcon">{{
            item.giftIcon
          }}</span>
        </div>
        <div class="price" v-if="item.id !== null">
          <span class="yen">&yen;</span>
          {{ item.salePrice }}
          <span class="unit">/{{ item.goodUint }}</span>
        </div>
        <div class="no-price" v-else>暂未定价</div>

        <div class="count-container" v-if="isAdded">
          <div class="plus" @click.stop="addItem(item)">
            <i
              class="iconfont"
              :class="item.added ? 'iconjianhao' : 'iconadd-o'"
            ></i>
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
    <div class="product-no-data" v-if="list.length == 0 && ajaxed">
      <img
        class="img"
        src="https://shicai56-statics.oss-cn-shanghai.aliyuncs.com/static/mini/img/no-data/goods-empty.png"
      />
      <p class="word">没有相关的商品数据</p>
      <div v-if="isAdded" class="go-find" @click="takePhoto">拍照找货</div>
    </div>
    <i-modal
      :visible="show"
      :actions="actions"
      actionMode="vertical"
      @onClick="onModalClick"
    >
      <view>是否为客户的畅销商品？</view>
    </i-modal>

    <i-modal
      :visible="delShow"
      okText="删除"
      @onOk="delclick"
      @onCancel="delShow = false"
    >
      <view>是否从采购需求中删除？</view>
    </i-modal>
  </scroll-view>
</template>


<script>
import { GoodsControllerApi, RequirementControllerApi } from "@/api/sc.api";
import { downloader, debounce } from "@/utils";

const THRESHOLD = 30; //偏移阈值
var STARTX = 0;
var ENDX = 0;
export default {
  props: {
    apiAjax: {
      type: Function,
      default: function () {
        return GoodsControllerApi.pagedListForBDUsingPOST;
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
    isAdded: {
      type: Boolean,
      default: false,
    },
    otherInfo: {
      type: Object,
      default: function () {
        return {
          customerId: "",
          addType: "",
          addedIds: "",
          requireId: "",
          formOffer: "",
        };
      },
    },
  },
  data() {
    return {
      scrollTop: 0,
      addedIds: [],
      show: false,
      delShow: false,
      actions: [
        {
          name: "是",
          loading: false,
        },
        {
          name: "否",
          loading: false,
        },
      ],
      goodsId: "",
      productId: "",
      purchasingId: "",
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
    canAjax() {
      return this.params.pageIndex < this.totalPage;
    },
  },
  watch: {
    inParams: {
      handler: function (newVal, oldVal) {
        this.scrollTop = 0;
        this.params.pageIndex = 1;
        if (newVal.keyword === "") {
          this.ajaxed = false;
          this.list = [];
        } else {
          this.getList();
        }
      },
      immediate: true,
    },
  },
  methods: {
    scroll: debounce(function (e) {
      this.scrollTop = e.mp.detail.scrollTop;
    }, 100),
    goDetail(item) {
      this.goto(
        `${this.AppUrls.SHOP_MALL_DETAIL}?productId=${item.productId}&goodsId=${item.id}`
      );
    },
    takePhoto() {
      this.goto(
        `${this.AppUrls.PURCHASING_TAKE_PHOTO}?customerId=${this.otherInfo.customerId}`
      );
    },
    getList() {
      if (this.inParams.categoryId == "") return;
      this.ajaxLoading = true;
      this.apiAjax({
        vo: {
          ...this.params,
          ...this.inParams,
        },
      }).then(({ body }) => {
        if (body.success) {
          this.ajaxed = true;
          let list = body.rows.map((item) => {
            item.uuid = String(item.productId) + String(item.id);
            item.swiper = false;
            item.goodsTypeStr =
              item.goodsType !== null
                ? this.Enumstr(item.goodsType, "GoodsType")
                : "";
            item.priceDown = item.id
              ? item.priceDown === null
                ? ""
                : item.priceDown
              : "";
            item.priceUp = item.id
              ? item.priceUp === 0
                ? 0
                : `+${item.priceUp}`
              : "";
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
            if (this.isAdded) {
              item.added = this.addedIds.some((pur) => pur.uuid === item.uuid);
            } else {
              item.added = false;
            }
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
    //添加到需求
    addItem(item) {
      this.productId = item.productId;
      this.goodsId = item.id;
      let purchasing = this.addedIds.find((el) => el.uuid === item.uuid);
      this.purchasingId = purchasing ? purchasing.purchasingId : "";
      if (item.added) {
        if (!this.purchasingId) return;
        this.delShow = true;
      } else {
        // 判断type
        if (this.otherInfo.addType == "purchasing") {
          this.show = true;
        } else if (this.otherInfo.addType == "recommend") {
          let form = {
            productId: this.productId,
            goodsId: this.goodsId,
            requireId: Number(this.otherInfo.requireId),
          };
          RequirementControllerApi.addWithLinkRequireUsingPOST({
            vo: form,
          }).then(({ body }) => {
            if (body.success) {
              this.$Toast({
                content: "设置成功！",
                type: "success",
              });
              this.handerPurchasing(false, body.data.id);
            } else {
              this.$Toast({
                content: body.msg,
                type: "error",
              });
            }
          });
        }
      }
    },
    onModalClick(e) {
      let index = e.mp.detail.index;
      let form = {
        isHot: index === 0,
        customerId: this.otherInfo.customerId,
        productId: this.productId,
        goodsId: this.goodsId,
        valid: true,
        requireSource: this.otherInfo.formOffer,
      };
      this.actions[index].loading = true;
      RequirementControllerApi.addWithProductUsingPOST({
        vo: form,
      }).then(({ body }) => {
        this.actions[index].loading = false;
        this.show = false;
        if (body.success) {
          this.$Toast({
            content: "已添加！",
            type: "success",
          });
          this.handerPurchasing(false, body.data.id);
        } else {
          this.$Toast({
            content: body.msg,
            type: "error",
          });
        }
      });
    },
    delclick(e) {
      RequirementControllerApi.deleteUsingGET({
        id: this.purchasingId,
      }).then(({ body }) => {
        this.delShow = false;
        if (body.success) {
          this.$Toast({
            content: "已从采购需求中删除",
            type: "success",
          });
          this.handerPurchasing(true);
        } else {
          this.$Toast({
            content: body.msg,
            type: "error",
          });
        }
      });
    },
    handerPurchasing(isDel, purId) {
      let uuid = String(this.productId) + String(this.goodsId);
      let goodsIndex = this.list.findIndex((el) => el.uuid === uuid);
      if (goodsIndex < 0) return;
      this.list[goodsIndex].added = !isDel;
      if (isDel) {
        let delIndex = this.addedIds.findIndex((item) => item.uuid === uuid);
        if (delIndex >= 0) {
          this.addedIds.splice(delIndex, 1);
        }
      } else {
        this.addedIds.push({
          uuid: uuid,
          purchasingId: purId,
        });
      }
      this.productId = "";
      this.goodsId = "";
      this.purchasingId = "";
    },
  },
  onLoad() {
    this.addedIds = this.otherInfo.addedIds
      ? this.clearData(this.otherInfo.addedIds)
      : [];
    // if (!this.autoLoad) return
    // this.getList()
  },
};
</script>

<style lang="less">
@import url("../../styles/base.less");
.product-item {
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
  .product-img {
    display: block;
    width: 80px;
    height: 80px;
    border-radius: 4px;
  }
  .product-info {
    position: relative;
    flex: 1;
    padding: 4px 12px;
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
    }
    .spec {
      font-size: 11px;
      color: @light_gray;
      height: 20px;
      line-height: 20px;
      margin-top: 4px;
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
    .count-container {
      display: flex;
      position: absolute;
      right: 12px;
      bottom: 8px;
      .reduce,
      .plus {
        width: 20px;
        height: 20px;
      }
      .value {
        width: 36px;
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

.product-no-data {
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
  .go-find {
    width: 100px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    color: @base_red;
    border: 1px solid @base_red;
    font-size: 15px;
    margin: 20px auto 0;
  }
}
</style>

