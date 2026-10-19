// Flat-config port of the rules from eslint-config-react-app (+ react-app/jest),
// which is unmaintained and pinned to ESLint 8. Rule levels match the original;
// renamed/removed rules are noted inline.
//
// Stays on ESLint 9: eslint-plugin-react and eslint-plugin-jsx-a11y don't support
// ESLint 10 (react's version "detect" calls the removed context.getFilename()).
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importX from "eslint-plugin-import-x";
import jest from "eslint-plugin-jest";
import testingLibrary from "eslint-plugin-testing-library";
import stylistic from "@stylistic/eslint-plugin";
import globals from "globals";
import confusingBrowserGlobals from "confusing-browser-globals";

export default tseslint.config(
    { ignores: ["dist/", "coverage/", "build/"] },

    {
        files: ["**/*.{js,jsx,cjs,mjs,ts,tsx}"],
        plugins: {
            react,
            "react-hooks": reactHooks,
            "jsx-a11y": jsxA11y,
            "import": importX,
            "@stylistic": stylistic,
        },
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: { ecmaFeatures: { jsx: true } },
            globals: {
                ...globals.browser,
                ...globals.commonjs,
                ...globals.es2015,
                ...globals.jest,
                ...globals.node,
            },
        },
        settings: { react: { version: "detect" } },
        rules: {
            "array-callback-return": "warn",
            "default-case": ["warn", { commentPattern: "^no default$" }],
            "eqeqeq": ["warn", "smart"],
            "no-array-constructor": "warn",
            "no-caller": "warn",
            "no-cond-assign": ["warn", "except-parens"],
            "no-const-assign": "warn",
            "no-control-regex": "warn",
            "no-delete-var": "warn",
            "no-dupe-args": "warn",
            "no-dupe-class-members": "warn",
            "no-dupe-keys": "warn",
            "no-duplicate-case": "warn",
            "no-empty-character-class": "warn",
            "no-empty-pattern": "warn",
            "no-eval": "warn",
            "no-ex-assign": "warn",
            "no-extend-native": "warn",
            "no-extra-bind": "warn",
            "no-extra-label": "warn",
            "no-fallthrough": "warn",
            "no-func-assign": "warn",
            "no-implied-eval": "warn",
            "no-invalid-regexp": "warn",
            "no-iterator": "warn",
            "no-label-var": "warn",
            "no-labels": ["warn", { allowLoop: true, allowSwitch: false }],
            "no-lone-blocks": "warn",
            "no-loop-func": "warn",
            "no-multi-str": "warn",
            "no-global-assign": "warn",
            "no-unsafe-negation": "warn",
            "no-new-func": "warn",
            "no-object-constructor": "warn", // was no-new-object
            "no-new-native-nonconstructor": "warn", // was no-new-symbol
            "no-new-wrappers": "warn",
            "no-obj-calls": "warn",
            "no-octal": "warn",
            "no-octal-escape": "warn",
            "no-redeclare": "warn",
            "no-regex-spaces": "warn",
            "no-restricted-syntax": ["warn", "WithStatement"],
            "no-script-url": "warn",
            "no-self-assign": "warn",
            "no-self-compare": "warn",
            "no-sequences": "warn",
            "no-shadow-restricted-names": "warn",
            "no-sparse-arrays": "warn",
            "no-template-curly-in-string": "warn",
            "no-this-before-super": "warn",
            "no-throw-literal": "warn",
            "no-undef": "error",
            "no-restricted-globals": ["error", ...confusingBrowserGlobals],
            "no-unreachable": "warn",
            "no-unused-expressions": ["error", { allowShortCircuit: true, allowTernary: true, allowTaggedTemplates: true }],
            "no-unused-labels": "warn",
            "no-unused-vars": ["warn", { args: "none", ignoreRestSiblings: true, caughtErrors: "none" }],
            "no-use-before-define": ["warn", { functions: false, classes: false, variables: false }],
            "no-useless-computed-key": "warn",
            "no-useless-concat": "warn",
            "no-useless-constructor": "warn",
            "no-useless-escape": "warn",
            "no-useless-rename": ["warn", { ignoreDestructuring: false, ignoreImport: false, ignoreExport: false }],
            "no-with": "warn",
            "require-yield": "warn",
            "strict": ["warn", "never"],
            "unicode-bom": ["warn", "never"],
            "use-isnan": "warn",
            "valid-typeof": "warn",
            "no-restricted-properties": [
                "error",
                { object: "require", property: "ensure", message: "Please use import() instead." },
                { object: "System", property: "import", message: "Please use import() instead." },
            ],
            "getter-return": "warn",

            // Formatting rules moved out of ESLint core
            "@stylistic/dot-location": ["warn", "property"],
            "@stylistic/new-parens": "warn",
            "@stylistic/no-mixed-operators": ["warn", {
                groups: [
                    ["&", "|", "^", "~", "<<", ">>", ">>>"],
                    ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
                    ["&&", "||"],
                    ["in", "instanceof"],
                ],
                allowSamePrecedence: false,
            }],
            "@stylistic/no-whitespace-before-property": "warn",
            "@stylistic/rest-spread-spacing": ["warn", "never"],

            "import/first": "error",
            "import/no-amd": "error",
            "import/no-anonymous-default-export": "warn",
            "import/no-webpack-loader-syntax": "error",

            "react/jsx-uses-vars": "warn",
            "react/jsx-uses-react": "warn",
            "react/forbid-foreign-prop-types": ["warn", { allowInPropTypes: true }],
            "react/jsx-no-comment-textnodes": "warn",
            "react/jsx-no-duplicate-props": "warn",
            "react/jsx-no-target-blank": "warn",
            "react/jsx-no-undef": "error",
            "react/jsx-pascal-case": ["warn", { allowAllCaps: true, ignore: [] }],
            "react/no-danger-with-children": "warn",
            "react/no-direct-mutation-state": "warn",
            "react/no-is-mounted": "warn",
            "react/no-typos": "error",
            "react/require-render-return": "error",
            "react/style-prop-object": "warn",

            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",

            "jsx-a11y/alt-text": "warn",
            "jsx-a11y/anchor-has-content": "warn",
            "jsx-a11y/anchor-is-valid": ["warn", { aspects: ["noHref", "invalidHref"] }],
            "jsx-a11y/aria-activedescendant-has-tabindex": "warn",
            "jsx-a11y/aria-props": "warn",
            "jsx-a11y/aria-proptypes": "warn",
            "jsx-a11y/aria-role": ["warn", { ignoreNonDOM: true }],
            "jsx-a11y/aria-unsupported-elements": "warn",
            "jsx-a11y/heading-has-content": "warn",
            "jsx-a11y/iframe-has-title": "warn",
            "jsx-a11y/img-redundant-alt": "warn",
            "jsx-a11y/no-access-key": "warn",
            "jsx-a11y/no-distracting-elements": "warn",
            "jsx-a11y/no-redundant-roles": "warn",
            "jsx-a11y/role-has-required-aria-props": "warn",
            "jsx-a11y/role-supports-aria-props": "warn",
            "jsx-a11y/scope": "warn",
        },
    },

    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parser: tseslint.parser,
        },
        plugins: { "@typescript-eslint": tseslint.plugin },
        rules: {
            "default-case": "off",
            "no-dupe-class-members": "off",
            "no-undef": "off",
            "@typescript-eslint/consistent-type-assertions": "warn",
            "no-array-constructor": "off",
            "@typescript-eslint/no-array-constructor": "warn",
            "no-redeclare": "off",
            "@typescript-eslint/no-redeclare": "warn",
            "no-use-before-define": "off",
            "@typescript-eslint/no-use-before-define": ["warn", { functions: false, classes: false, variables: false, typedefs: false }],
            "no-unused-expressions": "off",
            "@typescript-eslint/no-unused-expressions": ["error", { allowShortCircuit: true, allowTernary: true, allowTaggedTemplates: true }],
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["warn", { args: "none", ignoreRestSiblings: true, caughtErrors: "none" }],
            "no-useless-constructor": "off",
            "@typescript-eslint/no-useless-constructor": "warn",
        },
    },

    {
        files: ["**/__tests__/**/*", "**/*.{spec,test}.*"],
        plugins: { jest, "testing-library": testingLibrary },
        languageOptions: { globals: globals.jest },
        rules: {
            "jest/no-conditional-expect": "error",
            "jest/no-identical-title": "error",
            "jest/no-interpolation-in-snapshots": "error",
            "jest/no-jasmine-globals": "error",
            // jest/no-jest-import was removed from eslint-plugin-jest
            "jest/no-mocks-import": "error",
            "jest/valid-describe-callback": "error",
            "jest/valid-expect": "error",
            "jest/valid-expect-in-promise": "error",
            "jest/valid-title": "warn",

            "testing-library/await-async-queries": "error", // was await-async-query
            "testing-library/await-async-utils": "error",
            "testing-library/no-await-sync-queries": "error", // was no-await-sync-query
            "testing-library/no-container": "error",
            "testing-library/no-debugging-utils": "error",
            "testing-library/no-dom-import": ["error", "react"],
            "testing-library/no-node-access": "error",
            "testing-library/no-promise-in-fire-event": "error",
            "testing-library/no-render-in-lifecycle": "error", // was no-render-in-setup
            "testing-library/no-unnecessary-act": "error",
            // testing-library/no-wait-for-empty-callback was removed from the plugin
            "testing-library/no-wait-for-multiple-assertions": "error",
            "testing-library/no-wait-for-side-effects": "error",
            "testing-library/no-wait-for-snapshot": "error",
            "testing-library/prefer-find-by": "error",
            "testing-library/prefer-presence-queries": "error",
            "testing-library/prefer-query-by-disappearance": "error",
            "testing-library/prefer-screen-queries": "error",
            "testing-library/render-result-naming-convention": "error",
        },
    },
);
