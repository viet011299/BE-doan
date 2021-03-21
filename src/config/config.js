const glob = require("glob");
exports.loadRouters = () => {
  const files = glob.sync("src/app/router/**/*.js", {
    ignore: "**/node_modules/**"
  });
  return files;
};
exports.loadModels = () => {
  const files = glob.sync("src/app/models/**/*.js", {
    ignore: "**/node_modules/**"
  });
  return files;
};
