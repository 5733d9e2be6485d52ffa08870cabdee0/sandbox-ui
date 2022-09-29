/* eslint-disable */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const BG_IMAGES_DIRNAME = "bgimages";
const { dependencies, federatedModuleName } = require("./package.json");
delete dependencies.serve; // Needed for nodeshift bug
const webpack = require("webpack");
const ChunkMapper = require("@redhat-cloud-services/frontend-components-config/chunk-mapper");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isPatternflyStyles = (stylesheet) =>
  stylesheet.includes("@patternfly/react-styles/css/") ||
  stylesheet.includes("@patternfly/react-core/");

const ASSET_PATH = process.env.DEMO_APP ? "/" : "auto";

module.exports = (env, argv) => {
  const isProduction = argv && argv.mode === "production";
  return {
    entry: {
      app: path.resolve(__dirname, "src", "index.tsx"),
    },
    module: {
      rules: [
        {
          test: /\.(tsx|ts|jsx)?$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: false,
                experimentalWatchApi: true,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
          include: (stylesheet) => !isPatternflyStyles(stylesheet),
          sideEffects: true,
        },
        {
          test: /\.css$/,
          include: isPatternflyStyles,
          use: ["null-loader"],
          sideEffects: true,
        },
        {
          test: /\.(ttf|eot|woff|woff2)$/,
          type: "asset/resource",
          generator: {
            filename: isProduction ? "[contenthash:8].[ext]" : "[name].[ext]",
          },
        },
        {
          test: /\.(svg|jpg|jpeg|png|gif)$/i,
          type: "asset",
          generator: {
            filename: isProduction ? "[contenthash:8].[ext]" : "[name].[ext]",
          },
        },
        {
          test: /\.(json)$/i,
          include: path.resolve(__dirname, "src/locales"),
          type: "asset",
          generator: {
            filename: isProduction
              ? "locales/[contenthash:8].[ext]"
              : "locales/[name].[ext]",
          },
        },
      ],
    },
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: ASSET_PATH,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public", "index.html"),
      }),
      new Dotenv({
        systemvars: true,
        silent: true,
      }),
      new CopyPlugin({
        patterns: [{ from: "./locales", to: "locales" }],
      }),
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash:8].css",
        chunkFilename: "[contenthash:8].css",
        insert: (linkTag) => {
          const preloadLinkTag = document.createElement("link");
          preloadLinkTag.rel = "preload";
          preloadLinkTag.as = "style";
          preloadLinkTag.href = linkTag.href;
          document.head.appendChild(preloadLinkTag);
          document.head.appendChild(linkTag);
        },
      }),
      new ChunkMapper({
        modules: [federatedModuleName],
      }),
      new webpack.container.ModuleFederationPlugin({
        name: federatedModuleName,
        filename: `${federatedModuleName}${
          isProduction ? "[chunkhash:8]" : ""
        }.js`,
        exposes: {
          "./SmartEventsApp": "./src/AppFederated",
        },
        shared: {
          ...dependencies,
          react: {
            singleton: true,
            requiredVersion: dependencies["react"],
          },
          "react-dom": {
            singleton: true,
            requiredVersion: dependencies["react-dom"],
          },
          "react-router-dom": {
            singleton: false, // consoledot needs this to be off to be able to upgrade the router to v6. We don't need this to be a singleton, so let's keep this off
            requiredVersion: dependencies["react-router-dom"],
          },
          "react-i18next": {
            singleton: true,
            requiredVersion: dependencies["react-i18next"],
          },
          "@rhoas/app-services-ui-components": {
            singleton: true,
            requiredVersion: dependencies["@rhoas/app-services-ui-components"],
          },
          "@patternfly/quickstarts": {
            singleton: true,
            requiredVersion: "*",
          },
        },
      }),
    ],
    resolve: {
      extensions: [".js", ".ts", ".tsx", ".jsx"],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: path.resolve(__dirname, "./tsconfig.json"),
        }),
      ],
      symlinks: false,
      cacheWithContext: false,
    },
  };
};
