<template>
<uni-shadow-root class="navBar-navBar"><view class="nav">
    <view class="fixed-nav">
        <view class="status" :style="'height: '+(status)+'px;'+(containerStyle)"></view>
        <view class="navbar" :style="'height:'+(navHeight)+'px;'+(containerStyle)">
            <view class="icon-warp" v-if="iconShow">
                <view class="back-icon" @click="back">
                    <image :src="white ? backIcon.white : backIcon.default"></image>
                </view>
                <view class="home-icon" v-if="homeShow" @click="home">
                    <image :src="white ? homeIcon.white : homeIcon.default"></image>
                </view>
            </view>
            <view class="nav-icon" v-if="titleImg" @click="titleTap">
                <image :src="titleImg"></image>
            </view>
            <view class="nav-title" v-if="titleText && !titleImg">
                <text :style="textStyle">{{titleText}}</text>
            </view>
        </view>
    </view>
    <view class="hold-nav" :style="'width: 100%;height: '+(status + navHeight)+'px'"></view>
</view></uni-shadow-root>
</template>

<script>

global['__wxVueOptions'] = {components:{}}

global['__wxRoute'] = 'navBar/navBar'
// pages/navBar/navBar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        background: {
            type: String,
            value: 'rgba(255, 255, 255, 1)'
        },
        color: {
            type: String,
            value: '#1C2438'
        },
        titleText: {
            type: String,
            value: '导航栏'
        },
        titleImg: {
            type: String,
            value: ''
        },
        iconShow: {
            type: Boolean,
            value: true
        },
        backShow: {
            type: Boolean,
            value: true
        },
        backConfirm: {
            type: Boolean,
            value: false
        },
        homeShow: {
            type: Boolean,
            value: true
        },
        fontSize: {
            type: Number,
            value: 19
        },
        iconHeight: {
            type: Number,
            value: 20
        },
        iconWidth: {
            type: Number,
            value: 20
        },
        white: {
            type: Boolean,
            value: false
        }
        
    },
    attached: function () {
        var that = this;
        that.setNavSize();
        that.setStyle();
    },
    data: {
        homeIcon: {
            default: '/static/imgs/nav/home.png',
            white: '/static/imgs/nav/home_fff.png'
        },
        backIcon: {
            default: '/static/imgs/nav/back.png',
            white: '/static/imgs/nav/back_fff.png'
        }
    },
    methods: {
        // 通过获取系统信息计算导航栏高度
        setNavSize: function () {
            var that = this
                , sysinfo = wx.getSystemInfoSync()
                , statusHeight = sysinfo.statusBarHeight
                , isiOS = sysinfo.system.indexOf('iOS') > -1
                , navHeight;
            if (!isiOS) {
                navHeight = 48;
            } else {
                navHeight = 44;
            }
            that.setData({
                status: statusHeight,
                navHeight: navHeight
            })
        },
        setStyle: function () {
            var that = this
                , containerStyle
                , textStyle
                , iconStyle;
            containerStyle = [
                'background:' + that.data.background
            ].join(';');
            textStyle = [
                'color:' + that.data.color,
                'font-size:' + that.data.fontSize + 'px'
            ].join(';');
            iconStyle = [
                'width: ' + that.data.iconWidth + 'px',
                'height: ' + that.data.iconHeight + 'px'
            ].join(';');
            that.setData({
                containerStyle: containerStyle,
                textStyle: textStyle,
                iconStyle: iconStyle
            })
        },
        // 返回事件
        back: function () {
            if(!this.data.backConfirm){
                wx.navigateBack({
                    delta: 1
                })
            }
            this.triggerEvent('back', { back: 1 })
        },
        home: function () {
            wx.reLaunch({
                url: '/pages/index/index'
            })
            this.triggerEvent('home', {});
        },
        titleTap(){
            this.triggerEvent('titleClick');
        }
    }
})
export default global['__wxComponents']['navBar/navBar']
</script>
<style platform="mp-weixin">
.fixed-nav{
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 299;
}
.navbar{
    position: relative;
}

.icon-warp{
    position: absolute;
    display: flex;
    height: 32px;
    top: 24px;
    left: 8px;
    transform: translateY(-50%);
    border-radius:16px;
}
.back-icon, .home-icon{
    position: relative;
    width: 28px;
    padding: 6px 0;
    height: 100%;
    transform: scale(1);
    transition: transform .2s;
}
.back-icon:active, .home-icon:active{
    transform: scale(1.1);
}


.home-icon{
    text-align:right;
}
.back-icon image{
    position: relative;
    top: -2px;
    width: 22px;
    height: 22px;
    margin: 0 auto;
}
.home-icon image{
    position: relative;
    top: -2px;
    width: 22px;
    height: 22px;
    margin: 0 auto;
}
.nav-title, .nav-icon{
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    font-size: 0;
    font-weight: bold;
}

.nav-icon{
    width: 47.733333%;
    height: 72.7272%;
}

.nav-icon image{
    width: 100%;
    height: 100%;
}
</style>