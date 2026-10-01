import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Data hooks reach TanStack Query through `BaseQuery`; only the base class, the provider and the
  // layout that hands server-fetched data to the client cache import it directly.
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/lib/query/base-query.ts", "src/providers/query-provider.tsx", "src/app/(dashboard)/layout.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@tanstack/react-query",
              message: "Extend BaseQuery (src/lib/query/base-query.ts) in a use-*.ts hook instead.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
