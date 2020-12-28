<template>
  <div class="price-key-board" :class="[{'show': show},iClass]">
    <div class="input" v-if="!hidden" @click="show = true">{{ number }}</div>
    <div class="key-board-mask" @click="close"></div>
    <div class="key-board-content">
      <div class="warp">
        <i class="iconfont iconxingzhuangjiehe2" @click="close"></i>
        <div class="header">
          <block v-if="tipShow">
            <span class="tag">{{ type }}</span>
            <span class="price-down" v-if="!isResale">{{ down }}</span>
            <span class="price-up" v-if="!isResale">{{ up }}</span>
            <span class="sale-price" v-if="showPrice">&yen; {{ showPrice }}</span>
            <span class="history sale-price" v-if="lastBuyTime">{{ lastBuyTime }}</span>
          </block>
          <div class="priceTit" v-if="!tipShow">
            <span class="sale-price">{{ couponTitle }}</span>
          </div>
        </div>

        <div class="value-box cursor">
          <span class="unit" v-if="type">&yen;</span>
          {{ value }}
        </div>

        <div class="board-content">
          <div class="numbers">
            <div
              class="num-item"
              :class="el == '.' && 'grow6'"
              @click="numClick(el)"
              v-for="el in numbers"
              :key="el"
            >{{ el }}</div>
          </div>
          <div class="btns">
            <div class="btn-item" @click="del">
              <i class="iconfont iconxingzhuangjiehe4"></i>
            </div>
            <div class="btn-item red" @click="save">确认</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./priceKeyborad.ts"></script>

<style lang="less">
@import url("../styles/base.less");
.price-key-board {
  display: inline-block;
  text-align: left;
  & + & {
    margin-left: 10px;
  }
  &.show {
    .key-board-mask {
      display: block;
    }
    .key-board-content {
      transform: translate(-50%, -50%);
    }
  }
  .input {
    display: inline-block;
    width: 100%;
    min-width: 40px;
    height: 32px;
    background: rgba(248, 248, 249, 1);
    border: 1px solid rgba(221, 222, 225, 1);
    color: @base_black;
    font-size: 14px;
    line-height: 32px;
    padding: 0 4px;
    overflow: hidden;
  }
  .key-board-mask {
    display: none;
    position: fixed;
    z-index: 340;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    left: 0;
    top: 0;
  }
  .key-board-content {
    position: fixed;
    z-index: 350;
    width: 280px;
    background-color: #fff;
    border-radius: 4px;
    left: 50%;
    top: 50%;
    transform: translateY(900px);
    transition: transform 0.2s;
    .warp {
      position: relative;
      width: 100%;
      height: 100%;
      .iconxingzhuangjiehe2 {
        position: absolute;
        right: 8px;
        top: 0;
        color: @tip_gray;
        font-size: 22px;
        &:active {
          transform: scale(1.1);
        }
      }
    }
    .header {
      width: 100%;
      height: 32px;
      line-height: 32px;
      padding: 0 8px;
      border-bottom: 1px solid @gry_border;
      .history {
        color: #666;
      }
      .priceTit {
        width: 100%;
        text-align: center;
      }
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
      }
      .price-down,
      .price-up {
        font-size: 12px;
        font-weight: 400;
        margin-left: 8px;
      }
      .price-down {
        color: @base_green;
      }
      .price-up {
        color: @base_red;
      }

      .sale-price {
        font-size: 12px;
        color: #666;
        margin-left: 8px;
      }
    }
    .value-box {
      position: relative;
      width: 100%;
      height: 70px;
      line-height: 70px;
      margin: 12px 0;
      padding: 0 8px;
      font-size: 49px;
      font-weight: 400;
      color: @base_black;
      text-align: right;
      .unit {
        font-size: 20px;
      }
    }
    .board-content {
      display: flex;
      justify-content: center;
      width: 100%;
      padding: 8px;
      .numbers {
        width: 204px;
        display: flex;
        flex-wrap: wrap;
        .num-item {
          width: 60px;
          height: 60px;
          line-height: 60px;
          text-align: center;
          border-radius: 30px;
          background-color: #efefef;
          color: @base_black;
          font-weight: 400;
          font-size: 22px;
          margin: 0 8px 8px 0;
          &.grow6 {
            flex-grow: 2;
          }
          &:active {
            background-color: #ddd;
          }
        }
      }
      .btns {
        flex: 1;
        .btn-item {
          width: 60px;
          height: 128px;
          line-height: 128px;
          text-align: center;
          border-radius: 30px;
          background-color: #efefef;
          color: @base_black;
          font-weight: 400;
          font-size: 22px;
          margin-bottom: 8px;
          &:active {
            background-color: #ddd;
          }
          &.red {
            background-color: @base_red;
            color: #fff;
            font-size: 16px;
            font-weight: 500;
            word-wrap: break-word;
            &:active {
              background-color: @light_red;
            }
          }
        }
      }
    }
  }
}

.cursor::after {
  position: absolute;
  content: "";
  display: block;
  right: 8px;
  top: 8px;
  width: 1px;
  height: 54px;
  animation: blink 1s infinite steps(1, start);
}

@keyframes blink {
  0% {
    background-color: white;
  }
  50% {
    background-color: #00c203;
  }
  100% {
    background-color: white;
  }
}
</style>