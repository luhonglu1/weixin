const ci = require("miniprogram-ci");
let version = require("../package.json")["version"];
let { projectMode, desc } = require("../projectEnter");
let appId = require("../src/manifest.json")["appid"];

let projectPath = process.cwd() + `/dist/build/mp-weixin`;
let robot = 1; //测试上传机器人

if (projectMode == "pro") {
  robot = 2; //生产上传机器人
}

if (!version) throw new Error("版本号出错");
if (!appId) throw new Error("缺少appid");
if (!desc) desc = new Date() + "ci上传";

const project = new ci.Project({
  appid: appId,
  type: "miniProgram",
  projectPath,
  privateKeyPath: process.cwd() + `/private.${appId}.key`,
  ignores: ["node_modules/**/*"],
});

ci.upload({
  project,
  version,
  desc,
  robot,
  setting: {
    es6: true,
    minify: true,
    minifyJS: true,
    minifyWXML: true,
    minifyWXSS: true,
    autoPrefixWXSS: true,
  },
  onProgressUpdate: console.log,
})
  .then((res) => {
    console.log(res);
    console.log("上传成功");
  })
  .catch((error) => {
    if (error.errCode == -1) {
      console.log("上传成功");
    }
    console.log(error);
    console.log("上传失败");
    process.exit(-1);
  });
