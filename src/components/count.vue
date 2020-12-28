<template>
    <div class="count-container" :class="iClass">
        <div v-show="selfValue > 0" class="reduce" @click.stop="reduce"><i class="iconfont icondel"></i></div>
        <div v-show="selfValue > 0" class="value">{{ selfValue }}</div>
        <div class="plus" @click.stop="plus"><i class="iconfont iconadd-o"></i></div>
    </div>
</template>

<script>
export default {
    props:{
        iClass: {
            type: String,
            default: ''
        },
        value: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            selfValue: 0
        }
    },
    methods: {
        plus(){
            this.selfValue++;
            this.$emit('onPlus');
        },
        reduce(){
            if(this.selfValue == 0) return
            this.selfValue--;
            this.$emit('onReduce');
        }
    },
}
</script>


<style lang="less">
@import url('../styles/base.less');
    .count-container{
        display: flex;
        .reduce,.plus{
            width: 20px;
            height: 20px;
        }
        .value{
            width: 36px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            font-size: 16px;
            padding: 0 4px;
            color: @base_black;
        }
        .iconfont{
            color: @base_red;
            font-size: 20px;
        }
    }
</style>
