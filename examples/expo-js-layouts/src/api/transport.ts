import type { ApiTransport, Envelope } from "@/lib/api/client";
import { handleApiRequest } from "./router";

/** Artificial delay so loading states are visible; the sample API is otherwise instant. */
const LATENCY_MS = 250;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * The in-process stand-in for HTTP. Requests and answers go through JSON, as they would over the wire,
 * so no handler can hand the app a shared object it could mutate by accident.
 */
export const sampleTransport: ApiTransport = {
  async send({ method, path, body, accessToken }) {
    await wait(LATENCY_MS);
    const payload = body === undefined ? undefined : (JSON.parse(JSON.stringify(body)) as unknown);
    const { status, body: envelope } = await handleApiRequest({ method, path, body: payload, accessToken });
    return { status, statusText: String(status), body: JSON.parse(JSON.stringify(envelope)) as Envelope };
  },
};
