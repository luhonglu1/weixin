let projectMode = process.argv[2]; //  test  pro
let desc = process.argv[3] || "暂无备注";

// 下面两行代码 获取projectMode后把保存起来，写入到projectEnter.js里，方便项目中的其它文件里引入使用

if (projectMode !== "test" && projectMode !== "pro") {
  throw new Error("环境配置参数有误，请输入 test 或 pro");
}

let fs = require("fs");
// 临时记录上传模式 以及 描述 完成或抛出异常后初始化临时文件
fs.writeFileSync(
  "./projectEnter.js",
  `exports.projectMode = '${projectMode}';\n exports.desc = '${desc}';`
);

// // 下面两行代码继续执行命令（npm run serve），执行默认命令开始上传
let exec = require("child_process").execSync;

// exec("npm run build:mp-weixin", { stdio: "inherit" });

try {
  exec("npm run ci", { stdio: "inherit" });
} catch (error) {
  fs.writeFileSync(
    "./projectEnter.js",
    `exports.projectMode = '';\n exports.desc = '';`
  );
}

fs.writeFileSync(
  "./projectEnter.js",
  `exports.projectMode = '';\n exports.desc = '';`
);
