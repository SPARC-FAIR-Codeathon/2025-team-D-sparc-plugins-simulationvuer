import path from "path";
import { resolve } from "node:path";
const pathSrc = path.resolve(__dirname, "./src");
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import vueJsx from '@vitejs/plugin-vue-jsx';
import cssInjected from 'vite-plugin-css-injected-by-js'
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export default defineConfig(({ command, mode }) => {
  const config = {
    plugins: [
      vue(),
      vueJsx(),
      cssInjected(),
      Components({
        // Allow auto load markdown components under `./src/components/`.
        extensions: ["vue", "md"],
        // Allow auto import and register components used in markdown.
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [
          ElementPlusResolver({
            importStyle: "sass",
          }),
        ],
        dts: "src/components.d.ts",
      }),
    ],
    build: {
      lib: {
        entry: path.resolve(__dirname, "./src/components/index.js"),
        name: "SimulationVuer",
        formats: ['umd'],
        fileName: (format)=>`my-app.${format}.js`,
      },
      rollupOptions: {
        external: ["vue"],
        output: {
          globals: {
            vue: "Vue",
            "@abi-software/svg-sprite": "@abi-software/svg-sprite",
            "@abi-software/plotvuer": "@abi-software/plotvuer",
          },
        },
      },
    },
    resolve: {
      alias: {
        "~/": `${pathSrc}/`,
      },
    },
  };

  if (command === "serve") {
    config.server = {
      port: 8081,
    };
    config.define = {
      "process.env.HTTP_PROXY": 8081,
      global: "globalThis",
    };
  }

  if (mode === "app") {
    config.base = "./";

    ["build", "define", "resolve", "server"].forEach(key => delete config[key]);
  }

  return config;
});
