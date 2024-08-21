/**
 * Prettier formatting options
 * ===========================
 * For more details on options:
 * -- https://prettier.io/docs/en/options.html
 */

module.exports = {
    $schema: "http://json.schemastore.org/prettierrc",

    // Set-up initial Prettier defaults
    // (Many of these are Prettier's own defaults reiterated)
    arrowParens: "always",
    bracketSpacing: true,
    endOfLine: "lf",
    htmlWhitespaceSensitivity: "css",
    jsxBracketSameLine: true,
    jsxSingleQuote: false,
    printWidth: 120,
    proseWrap: "preserve",
    quoteProps: "consistent",
    requirePragma: false,
    semi: true,
    singleQuote: false,
    trailingComma: "none",
    tabWidth: 4,
    useTabs: false,

    // Overriding configurations on a per file/file-type basis
    overrides: [
        // Be strict about configuration files output
        // esp. package.json; keep in-sync with npm style
        {
            files: [".*rc", "package.json"],
            options: {
                parser: "json-stringify",
                requirePragma: false, // Would not be valid JSON anyway
                tabWidth: 2,
                trailingComma: "none"
            }
        },

        // Don't want so much whitespace in data files...
        {
            files: ["*.json"],
            excludeFiles: [".*rc", "package.json"],
            options: {
                parser: "json",
                requirePragma: false, // Would not be valid JSON anyway
                tabWidth: 2,
                trailingComma: "none"
            }
        }
    ]
};
