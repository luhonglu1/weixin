<template>
   <div class="search-hold-container link" @click="routerTo" @gotoPage="gotoPage">
       <i class="iconfont iconsearch"></i>搜索
   </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator"

@Component
export default class searchHold extends Vue {
    @Prop({ type:String, default:"" }) to

    routerTo(){
        if(!this.to) return
        this.gotoPage()
    }

    gotoPage(){
        this.$emit('gotoPage',this.to)
    }

}
</script>


<style lang="less">
@import url('../styles/base.less');
    .search-hold-container{
        width: 100%;
        height: 32px;
        line-height: 32px;
        background-color: @gry_background;
        color: @light_gray;
        font-size: 14px;
        padding: 0 13px;
        border-radius: 18px;
        .iconfont{
            color: @light_gray;
            font-size: 14px;
        }
    }
</style>
