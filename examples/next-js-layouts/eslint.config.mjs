import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const reactQuery = {
  name: "@tanstack/react-query",
  message: "Extend BaseQuery (src/lib/query/base-query.ts) in a use-*.ts hook instead.",
};
const apiBan = (name, message) => ({ name, message });
const componentApiBans = ["@/lib/api", "@/lib/api/client", "@/lib/api/session-expiry"].map((name) =>
  apiBan(name, "Components get data through a hook in src/hooks, never from the API client."),
);
const componentBans = [{ name: "next/headers", message: "Server request helpers do not belong in components; read them in a layout or page and pass props." }];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Layering (data flows one way): component -> hook -> service -> ApiClient -> API. A later block for the
  // same files replaces `no-restricted-imports`, so each block lists everything that applies to it.
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/**/*.test.ts", "src/lib/query/base-query.ts", "src/providers/query-provider.tsx", "src/app/(dashboard)/layout.tsx"],
    rules: { "no-restricted-imports": ["error", { paths: [reactQuery] }] },
  },
  // Components never fetch: no services, no API client, no `fetch`, no server request helpers.
  {
    files: ["src/components/**/*.{ts,tsx}"],
    ignores: ["src/**/*.test.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [reactQuery, ...componentBans, ...componentApiBans],
          patterns: [{ group: ["@/lib/services", "@/lib/services/*"], message: "Components get data through a hook in src/hooks, never from a service." }],
        },
      ],
      "no-restricted-globals": ["error", { name: "fetch", message: "Components never call fetch; use a hook." }],
    },
  },
  // Services sit below hooks: they must not know about hooks, components or React.
  {
    files: ["src/lib/services/**/*.{ts,tsx}"],
    ignores: ["src/**/*.test.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [reactQuery, { name: "react", message: "Services are plain classes; React belongs in hooks and components." }],
          patterns: [{ group: ["@/hooks", "@/hooks/*", "@/components", "@/components/*", "@/providers", "@/providers/*"], message: "A service must not import a hook, a component or a provider." }],
        },
      ],
    },
  },
  // Hooks and schemas do not reach for server-only request helpers either.
  {
    files: ["src/hooks/**/*.{ts,tsx}"],
    ignores: ["src/**/*.test.ts"],
    rules: {
      "no-restricted-imports": ["error", { paths: [reactQuery, ...componentBans, apiBan("@/lib/api", "Hooks call a service, not the API client."), apiBan("@/lib/api/client", "Hooks call a service, not the API client.")] }],
      "no-restricted-globals": ["error", { name: "fetch", message: "Hooks call a service; services call the API client." }],
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
