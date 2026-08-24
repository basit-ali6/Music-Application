import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    mode: "production",

    entry: "./src/index.js",

    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },

    devtool: "source-map",

  devServer: {
    static: "./dist",
    open: true,
    host: "0.0.0.0",
    port: 8080,

    proxy: [
        {
            context: ["/api/deezer"],
            target: "https://api.deezer.com",
            changeOrigin: true,

            pathRewrite: {
                "^/api/deezer": "/search",
            },
        },
    ],
},

    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/template.html",
            favicon: "./src/favicon.svg",
        }),
    ],

    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
};