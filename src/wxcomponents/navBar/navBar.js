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
