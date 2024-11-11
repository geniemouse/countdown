/**
 * `bun test`
 * ==========
 * Bun ships with a fast, built-in, Jest-compatible test runner.
 * Tests are executed with the Bun runtime, and support the following features.
 *
 * - TypeScript & JSX
 * - Lifecycle hooks
 * - Snapshot testing
 * - UI & DOM testing
 * - Watch mode with --watch
 * - Script pre-loading with --preload
 *
 * Bun aims for compatibility with Jest, but not everything is implemented.
 * To track compatibility, see this tracking issue:
 * https://github.com/oven-sh/bun/issues/1825
 *
 * Documentation:
 * -- https://bun.sh/docs/cli/test
 * -- https://bun.sh/docs/test/dom
 * -- https://bun.sh/docs/test/writing
 *
 */

import pkg from "../package.json";
import { describe, expect, test } from "bun:test";
import "./app.js";

test("APP namespace is exposed on window object", () => {
	expect(window.APP).toEqual(
		expect.objectContaining({
			VERSION: `v${pkg.version}`,
		}),
	);
});
