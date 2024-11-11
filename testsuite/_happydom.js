/**
 * Happy DOM
 * =========
 * Happy DOM is a JavaScript implementation of a web browser without its
 * graphical user interface. It includes many web standards from
 * WHATWG DOM and HTML.
 *
 * Having Happy DOM instantiated here & registering it directly with the
 * `./bunfig.toml` file means all tests have access to a simulated
 * browser environment.
 *
 * -- https://github.com/capricorn86/happy-dom
 */

import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();
