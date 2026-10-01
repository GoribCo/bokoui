// Lets `node --test` load the app's TypeScript: resolves the `@/*` alias and extensionless imports.
import { register } from "node:module";

register("./resolve-hook.mjs", import.meta.url);
