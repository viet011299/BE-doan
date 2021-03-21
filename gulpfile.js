const gulp = require("gulp");
const nodemon = require("gulp-nodemon");
const chalk = require("chalk");
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
  console.log('No NODE_ENV found, set NODE_ENV to "development"');
}

const paths = {
  serverJS: ["src/server.js", "src/config/**/*.js", "src/app/**/*.js", ".env"]
};

function nodemonWatch() {
  return nodemon({
    script: "src/server.js",
    nodeArgs: "babel-node",
    ext: "js",
    watch: paths.serverJS,
    signal: "SIGINT"
  })
    .on("restart", function() {
      console.log("%s Restart server", chalk.green("✓"));
    })
    .on("crash", function() {
      console.log("%s Crush", chalk.red("X"));
    });
}

exports.default = nodemonWatch;
