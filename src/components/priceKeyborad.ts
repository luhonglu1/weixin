import { Vue, Component, Prop, Watch } from "vue-property-decorator";

export class otherInfo {
  ownId?: String | Number;
  index?: String | Number = 0;
}

@Component({ name: "priceKeyboard" })
export default class priceKeyboard extends Vue {
  @Prop({ default: false }) hidden: Boolean;
  @Prop({ default: "" }) iClass: String;
  @Prop({ default: "" }) number: String | Number;
  @Prop({ default: 8 }) max: Number;
  @Prop({ default: "" }) up: String | Number;
  @Prop({ default: "" }) down: String | Number;
  @Prop({ default: "" }) type: String | Number;
  @Prop({ default: "" }) showPrice?: String | Number;
  @Prop({ default: true }) tipShow?: Boolean;
  @Prop({ default: false }) isResale?: Boolean;
  @Prop({ type: Object, default: { ownId: "", index: 0 } }) otherInfo;
  @Prop({ type: String, default: "" }) couponTitle;
  @Prop({ type: String, default: "" }) lastBuyTime;
  private show: boolean = false;
  private numbers: any[] = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, "."];
  private value: any = "";

  get priceTipShow() {
    return this.type && this.tipShow;
  }

  @Watch("number", { immediate: true })
  watchNumber(val: any, oldVal: any) {
    this.value = val;
  }

  @Watch("show")
  watchShow(val: Boolean, oldVal: Boolean) {
    if (val) {
      this.value = this.number;
    }
  }

  numClick(el): void {
    let arr: any[] = String(this.value).split("");
    if (arr.length >= this.max) return;
    if (arr.length == 1 && arr[0] == 0) {
      if (el == ".") {
        arr.push(el);
      } else {
        arr = [el];
      }
    } else {
      arr.push(el);
    }
    this.value = arr.join("");
  }

  del(): void {
    let arr = String(this.value).split("");
    arr.splice(arr.length - 1, 1);
    this.value = arr.join("");
  }

  save(): void {
    if (this.tipShow && Number(this.value) === 0) {
      return this.showToastTitle("销售金额不能为0");
    }
    if (isNaN(+this.value)) {
      return this.showToastTitle("请输入正确的数字");
    }
    if (!this.tipShow) {
      this.value = +(Math.floor(this.value * 100) / 100);
    }
    this.$emit("update:number", Number(this.value));
    this.$emit("onSave", {
      params: this.otherInfo,
      number: Number(this.value)
    });
    this.close();
  }

  close(): void {
    this.show = false;
    this.$emit("close");
  }
}
