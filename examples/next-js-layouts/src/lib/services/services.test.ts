import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ApiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { NotificationService } from "./notification.service";
import { RecordService } from "./record.service"; // demo
import { SessionService } from "./session.service";

/** Fake client: records calls and returns canned data. */
function fakeClient(data: unknown) {
  const calls: { method: string; path: string; payload?: unknown }[] = [];
  const client = {
    get: async (path: string, params?: unknown) => (calls.push({ method: "get", path, payload: params }), data),
    getPage: async (path: string, params?: unknown) => (calls.push({ method: "getPage", path, payload: params }), data),
    post: async (path: string, payload?: unknown) => (calls.push({ method: "post", path, payload }), data),
  } as unknown as ApiClient;
  return { client, calls };
}

const note = { id: "n1", kind: "action", title: "T", body: "B", time: "now", unread: true };

describe("NotificationService", () => {
  it("lists validated notifications", async () => {
    const { client, calls } = fakeClient([note]);
    const result = await new NotificationService(client).list();
    assert.equal(result[0].id, "n1");
    assert.deepEqual(calls[0], { method: "get", path: "/notifications", payload: undefined });
  });

  it("rejects an answer that does not match the schema", async () => {
    const { client } = fakeClient([{ id: 5 }]);
    await assert.rejects(new NotificationService(client).list());
  });

  it("marks read with ids, or with an empty body for all", async () => {
    const { client, calls } = fakeClient([note]);
    const service = new NotificationService(client);
    await service.markRead(["n1"]);
    await service.markRead();
    assert.deepEqual(calls.map((c) => c.payload), [{ ids: ["n1"] }, {}]);
    assert.ok(calls.every((c) => c.path === "/notifications/read"));
  });
});

describe("SessionService", () => {
  it("rejects a malformed session", async () => {
    const { client } = fakeClient({ user: null });
    await assert.rejects(new SessionService(client).getSession());
  });

  it("returns null on 401 and rethrows other errors", async () => {
    const failing = (status: number) =>
      ({ get: async () => { throw new ApiError(status, "x"); } }) as unknown as ApiClient;
    assert.equal(await new SessionService(failing(401)).getSession(), null);
    await assert.rejects(new SessionService(failing(500)).getSession(), ApiError);
  });
});

// demo:start
describe("RecordService", () => {
  it("passes params through and keeps meta", async () => {
    const meta = { total: 0, page: 1, pageSize: 8, totalPages: 1 };
    const { client, calls } = fakeClient({ items: [], meta });
    const result = await new RecordService(client).list({ q: "a", page: 2 });
    assert.deepEqual(result.meta, meta);
    assert.deepEqual(calls[0].payload, { q: "a", page: 2 });
  });

  it("rejects malformed records", async () => {
    const { client } = fakeClient({ items: [{ nope: true }], meta: { total: 1, page: 1, pageSize: 1, totalPages: 1 } });
    await assert.rejects(new RecordService(client).list());
  });
});
// demo:end
