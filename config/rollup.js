import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import browsersync from "rollup-plugin-browsersync";
import replace from "rollup-plugin-replace";
import rimraf from "rimraf";

const pkg = require("../package.json");
const version = pkg.version;

rimraf.sync(`./assets/js/bundle.js`);

export default {
    input: `./src/js/app.js`,
    output: {
        file: `./assets/js/bundle.js`,
        format: "iife"
    },
    plugins: [
        replace({
            delimiters: ["{{", "}}"],
            version
        }),
        browsersync({
            files: [`./**/*.html`, `./assets/**/*.css`, `./assets/**/*.js`],
            logLevel: "info", // options: "debug"/"info"
            open: false,
            port: 4000,
            server: {
                baseDir: `./`
                // directory: true
            }
        }),
        resolve(),
        babel({
            exclude: "node_modules/**" // only transpile our source code
        })
    ]
};
