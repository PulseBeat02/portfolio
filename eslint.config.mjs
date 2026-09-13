import {defineConfig, globalIgnores} from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
    ...nextVitals,
    ...nextTs,
    {
        rules: {
            "eol-last": ["error", "always"],
        },
    },
    globalIgnores([".next/**", "out/**", "next-env.d.ts"]),
]);
