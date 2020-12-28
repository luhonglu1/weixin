<template>
    <div class="search-input-warp" :class="{ 'on-search': (onSearch && !simple) } ">
        <div class="search-input-container link" :class="{ 'no-br': simple }">
            <i class="icon-search iconfont iconsearch"></i>
            <input v-model="keyword" class="input" type="text" :confirmType="confirmType" 
            :focus="selfFocus" :adjustPosition="false" @confirm="onConfirm" :placeholder="placeholder" />

            <i v-if="simple" @click="empty" class="simlpe-close iconfont iconguanbi" :class="{ 's-c-s': onSearch }"></i>
        </div>
        <div v-if="!simple" class="btn" @click="empty">取消</div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component({name:"scSearch"})
export default class scSearch extends Vue {
    @Prop({ type:String, default: '' }) value
    @Prop({ type:Boolean, default: false }) focus
    @Prop({ type:Boolean, default: false }) simple
    @Prop({ type: String, default: "请输入关键词" }) placeholder
    @Prop({ type: String, default: "search" }) comfirmType

    private keyword:string = ""
    private selfFocus:boolean = false

    get onSearch(){
        return this.keyword !== ''
    }

    @Watch("value", { immediate: true })
    watchValue(nv,ov){
        this.keyword = nv
    }

    onConfirm() {
        this.$emit('onConfirm', this.keyword);
        this.selfFocus = false;
    }

    empty(){
        this.keyword = '';
        this.$emit('onCancel');
        this.selfFocus = false;
    }

    onLoad(){
        this.selfFocus = this.focus;
    }    

}
</script>


<style lang="less">
@import url('../styles/base.less');
.search-input-warp {
    position: relative;
    width: 100%;
    z-index: 99;
    .search-input-container {
        position: relative;
        width: 100%;
        height: 32px;
        line-height: 20px;
        background-color: @gry_background;
        color: @light_gray;
        font-size: 14px;
        padding: 6px 13px 6px 36px;
        border-radius: 18px;
        transform: width .2s;
        &.no-br{
            border-radius: 0;
        }
        .icon-search {
            position: absolute;
            color: @light_gray;
            font-size: 14px;
            left: 13px;
        }
        .input {
            width: calc(100% - 20px);
            height: 20px;
            line-height: 20px;
            min-height: 20px;
            font-size: 14px;
            color: @base_black;
        }

        .simlpe-close{
            position: absolute;
            right: 20px;
            top: 8px;
            font-size: 0;
            color: @tip_gray;
            transition: all .2s;
            &.s-c-s{
                font-size: 16px;
                right: 12px;
            }
        }
    }
    .btn {
        position: absolute;
        right: 0;
        top: 0;
        transform: translate3d(56px,0,0);
        width: 56px;
        height: 32px;
        line-height: 32px;
        font-size: 16px;
        color: @base_black;
        transition: transform .2s;
        text-align: center;
        &:active {
            color: @base_red;
        }
    }
    &.on-search {
        .btn{
            transform: translate3d(0,0,0);
        }
        .search-input-container{
            width: calc(100% - 56px);
        }
    }
}
</style>
