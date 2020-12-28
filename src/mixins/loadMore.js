export default {
    data() {
        return {
            pageIndex: 1,
            pageSize: 10,
            totalPage: 1
        }
    },
    computed: {
        canNext() {
            return this.pageIndex < this.totalPage
        },
        loadText(){
            return this.canNext ? '加载中...' : '暂无更多数据'
        }
    },
    async loadMore() {
        console.warn("loadMore 应该由子类实现")
    },
    async onReachBottom() {
        if (!this.canNext) {
            wx.showToast({
                title: '已经到底啦',
                icon: 'none',
                duration: 2000
            })
            return
        }

        console.log(" PullTrait loadMore");
        try {
            this.pageIndex++;
            await this.loadMore();
        } catch (e) {
        }
    },
    async refreshList() {
        console.warn("refreshList 应该由子类实现")
    },

    async onPullDownRefresh() {
        this.pageIndex = 1;
        console.log("refreshList");
        try {
            await this.refreshList();
        } catch (e) {
        }
        setTimeout(() => {
            wx.stopPullDownRefresh()
        }, 100);
    }
}
