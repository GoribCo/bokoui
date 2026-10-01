import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { ApiClient } from "./client";
import { ApiError, isApiError } from "./errors";

interface Call {
  url: string;
  init: RequestInit;
}

let calls: Call[];
let reply: { status: number; body: unknown };
const realFetch = globalThis.fetch;

beforeEach(() => {
  calls = [];
  reply = { status: 200, body: { success: true, results: { ok: true } } };
  // Behave like the browser: relative base URL, no `next/headers`.
  Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
  globalThis.fetch = (async (url: string | URL | Request, init: RequestInit = {}) => {
    calls.push({ url: String(url), init });
    return new Response(JSON.stringify(reply.body), { status: reply.status });
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = realFetch;
  Reflect.deleteProperty(globalThis, "window");
});

const client = () => new ApiClient({ baseUrl: "/api/v1" });

describe("ApiClient", () => {
  it("unwraps results from the envelope", async () => {
    assert.deepEqual(await client().get("/x"), { ok: true });
  });

  it("builds the query string and skips undefined values", async () => {
    await client().get("/x", { a: 1, b: undefined, c: "two words" });
    assert.equal(calls[0].url, "/api/v1/x?a=1&c=two+words");
  });

  it("does not cache ordinary requests", async () => {
    await client().get("/x");
    assert.equal(calls[0].init.cache, "no-store");
  });

  it("passes cache options for shared requests", async () => {
    await client().get("/x", undefined, { revalidate: 60, tags: ["t"] });
    assert.deepEqual((calls[0].init as { next?: unknown }).next, { revalidate: 60, tags: ["t"] });
  });

  it("sends JSON bodies with the right method", async () => {
    await client().post("/x", { a: 1 });
    await client().put("/x", { a: 2 });
    await client().patch("/x", { a: 3 });
    await client().delete("/x");
    assert.deepEqual(calls.map((c) => c.init.method), ["POST", "PUT", "PATCH", "DELETE"]);
    assert.equal(calls[0].init.body, '{"a":1}');
    assert.equal((calls[0].init.headers as Record<string, string>)["Content-Type"], "application/json");
  });

  it("getPage returns items with meta, or a single page when meta is missing", async () => {
    const meta = { total: 5, page: 2, pageSize: 2, totalPages: 3 };
    reply.body = { success: true, results: [1, 2], meta };
    assert.deepEqual(await client().getPage("/x"), { items: [1, 2], meta });
    reply.body = { success: true, results: [1, 2, 3] };
    assert.deepEqual((await client().getPage("/x")).meta, { total: 3, page: 1, pageSize: 3, totalPages: 1 });
  });

  it("throws ApiError with status, message and code on failure", async () => {
    reply = { status: 403, body: { success: false, message: "Nope", code: "FORBIDDEN" } };
    await assert.rejects(client().get("/x"), (error: unknown) => {
      assert.ok(isApiError(error, 403));
      assert.equal((error as ApiError).code, "FORBIDDEN");
      assert.equal((error as ApiError).message, "Nope");
      return true;
    });
  });

  it("treats success:false on a 200 as an error", async () => {
    reply = { status: 200, body: { success: false, message: "bad" } };
    await assert.rejects(client().get("/x"), ApiError);
  });

  it("copes with an empty response body", async () => {
    globalThis.fetch = (async () => new Response("", { status: 200 })) as typeof fetch;
    assert.equal(await client().get("/x"), undefined);
  });
});

describe("isApiError", () => {
  it("matches by status only when given", () => {
    const error = new ApiError(404, "x");
    assert.equal(isApiError(error), true);
    assert.equal(isApiError(error, 404), true);
    assert.equal(isApiError(error, 500), false);
    assert.equal(isApiError(new Error("x")), false);
  });
});
