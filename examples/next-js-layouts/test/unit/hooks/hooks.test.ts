import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { queryKeys } from "@/lib/query/keys";
import type { Notification } from "@/lib/types";
import { useMarkNotificationsRead, useNotifications } from "@/hooks/use-notifications";

const note = (id: string, unread: boolean): Notification => ({ id, kind: "action", title: id, body: "b", time: "now", unread });

const realFetch = globalThis.fetch;
let served: Notification[];
let fail: boolean;
let release: (() => void) | undefined;

beforeEach(() => {
  fail = false;
  release = undefined;
  served = [note("a", true), note("b", true)];
  Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
  globalThis.fetch = (async () => {
    // Hold the answer until the test releases it, so the optimistic state can be observed.
    await new Promise<void>((resolve) => (release = resolve));
    return fail
      ? new Response(JSON.stringify({ success: false, message: "boom" }), { status: 500 })
      : new Response(JSON.stringify({ success: true, results: served }), { status: 200 });
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = realFetch;
  Reflect.deleteProperty(globalThis, "window");
});

/** Renders a component that runs `useHook` once and returns what it produced. */
function renderHook<T>(client: QueryClient, useHook: () => T): T {
  let result: T | undefined;
  const Probe = () => {
    result = useHook();
    return null;
  };
  renderToString(createElement(QueryClientProvider, { client }, createElement(Probe) as ReactNode));
  return result as T;
}

const newClient = () => new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
const unread = (client: QueryClient) =>
  client.getQueryData<Notification[]>(queryKeys.notifications)?.map((n) => n.unread);
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("useNotifications", () => {
  it("is pending before data arrives", () => {
    const state = renderHook(newClient(), useNotifications);
    assert.equal(state.isPending, true);
    assert.equal(state.data, undefined);
  });

  it("reads what is in the cache under the shared key", () => {
    const client = newClient();
    client.setQueryData(queryKeys.notifications, served);
    const state = renderHook(client, useNotifications);
    assert.deepEqual(state.data?.map((n) => n.id), ["a", "b"]);
  });
});

describe("useMarkNotificationsRead", () => {
  it("updates the list at once, then settles with the server answer", async () => {
    const client = newClient();
    client.setQueryData(queryKeys.notifications, served);
    const mutation = renderHook(client, useMarkNotificationsRead);

    const done = mutation.mutateAsync(["a"]);
    await tick();
    assert.deepEqual(unread(client), [false, true], "optimistic: only a is read, before the server answers");

    served = [note("a", false), note("b", true)];
    release?.();
    await done;
    await tick();
    release?.();
    assert.deepEqual(unread(client), [false, true]);
  });

  it("marks everything read when no ids are given", async () => {
    const client = newClient();
    client.setQueryData(queryKeys.notifications, served);
    const mutation = renderHook(client, useMarkNotificationsRead);
    const done = mutation.mutateAsync(undefined);
    await tick();
    assert.deepEqual(unread(client), [false, false]);
    served = [note("a", false), note("b", false)];
    release?.();
    await done;
    release?.();
  });

  it("rolls back when the server fails", async () => {
    const client = newClient();
    client.setQueryData(queryKeys.notifications, served);
    fail = true;
    const mutation = renderHook(client, useMarkNotificationsRead);
    const done = mutation.mutateAsync(["a"]).catch((error: unknown) => error);
    await tick();
    assert.deepEqual(unread(client), [false, true]);
    release?.();
    const error = await done;
    assert.ok(error instanceof Error);
    await tick();
    release?.();
    assert.deepEqual(unread(client), [true, true], "restored to the state before the click");
  });
});
