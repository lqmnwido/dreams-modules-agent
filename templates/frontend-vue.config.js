const path = require("path");
const { ModuleFederationPlugin } = require("webpack").container;

const remoteMode = process.env.VUE_APP_REMOTE || "off";

if (!["off", "on"].includes(remoteMode)) {
  throw new Error("VUE_APP_REMOTE must be off or on");
}

const isRemote = remoteMode === "on";
const base = (process.env.VUE_APP_MODUL || "http://localhost:{{port}}")
  .replace(/\/+$/, "");
const shell = (process.env.VUE_APP_SHELL || "http://localhost:3000")
  .replace(/\/+$/, "");

module.exports = {
  publicPath: isRemote ? base + "/" : "/",
  productionSourceMap: false,
  devServer: {
    port: Number(process.env.VUE_APP_MODUL_PORT || {{port}}),
    headers: isRemote ? { "Access-Control-Allow-Origin": shell } : {}
  },
  configureWebpack: {
    output: {
      uniqueName: "dreams-{{module}}",
      chunkLoadingGlobal: "webpackChunk_{{module}}"
    },
    plugins: isRemote
      ? [
          new ModuleFederationPlugin({
            name: "{{module}}",
            filename: "remoteEntry.js",
            exposes: require("./exposes"),
            remotes: {
              shell: "shell@" + shell + "/remoteEntry.js"
            },
            shared: Object.fromEntries(
              ["vue", "pinia", "vue-router", "vue-i18n", "@2enapps/ui"].map(
                (name) => [name, { singleton: true, requiredVersion: false }]
              )
            )
          })
        ]
      : []
  },
  chainWebpack(config) {
    config.resolve.alias.set("@", path.resolve(__dirname, "src"));
    config.entryPoints.clear();
    config.entry("app").add("./src/remote-entry.js");
    config.optimization.splitChunks({ chunks: "async" });
    config.resolve.symlinks(false);

    for (const name of ["pinia", "vue-router", "vue-i18n"]) {
      config.resolve.alias.set(name + "$", require.resolve(name));
    }
  }
};
