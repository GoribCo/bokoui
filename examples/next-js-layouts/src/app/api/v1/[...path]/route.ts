import { handleApiRequest } from "@/api/router";

/**
 * HTTP entry of the sample backend in `src/api`. The app calls it like any server (`/api/v1/...`);
 * with a real backend this file and the `src/api` folder are deleted.
 */
type Context = { params: Promise<{ path: string[] }> };

async function handle(request: Request, { params }: Context) {
  return handleApiRequest(request, (await params).path);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
