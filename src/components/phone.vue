<template>
    <a class="phone-link" @click.stop="makeCall">
        {{ telNumber }}
    </a>
</template>

<script>
    export default {
        props: {
            telNumber: {
                type: [String, Number],
                default: ''
            }
        },
        methods: {
            makeCall() {
                wx.makePhoneCall({
                    phoneNumber: String(this.telNumber)
                })
            }
        }
    }
</script>

<style lang="less">
    .phone-link{
        font-size: 1em;
        color: #007BFF;
        display: inline-block;
    }
</style>


