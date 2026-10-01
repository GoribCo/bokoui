import "server-only";
import { getServerApi } from "@/lib/api/server";
import { createServices } from "./index";

/** Services for Server Components, layouts and route files: they forward the visitor's cookies. */
export async function getServerServices(options?: { withCookies?: boolean }) {
  return createServices(await getServerApi(options));
}
