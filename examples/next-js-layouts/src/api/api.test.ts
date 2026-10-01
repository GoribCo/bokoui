import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/config/auth";
import { signToken } from "./jwt";
import { handleApiRequest } from "./router";

const signedIn = { cookie: `${ACCESS_TOKEN_COOKIE}=${signToken("user-1", "access", 900)}` };

interface Body {
  success: boolean;
  results?: unknown;
  meta?: { total: number; page: number; pageSize: number; totalPages: number };
  code?: string;
}

async function call(method: string, path: string, options: { auth?: boolean; body?: unknown; cookie?: string } = {}) {
  const url = new URL(`http://localhost/api/v1${path}`);
  const request = new Request(url, {
    method,
    headers: { ...(options.auth === false ? {} : signedIn), ...(options.cookie ? { cookie: options.cookie } : {}), "content-type": "application/json" },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const response = await handleApiRequest(request, url.pathname.replace("/api/v1", "").split("/").filter(Boolean));
  return { status: response.status, body: (await response.json()) as Body };
}

describe("auth endpoints", () => {
  const post = (path: string, headers: Record<string, string>, body?: unknown) => {
    const url = new URL(`http://localhost/api/v1${path}`);
    return handleApiRequest(
      new Request(url, { method: "POST", headers: { "content-type": "application/json", ...headers }, body: body === undefined ? undefined : JSON.stringify(body) }),
      url.pathname.replace("/api/v1", "").split("/").filter(Boolean),
    );
  };

  it("login sets httpOnly access and refresh cookies", async () => {
    const response = await post("/auth/login", {}, { email: "a@b.co", password: "x" });
    assert.equal(response.status, 200);
    const cookies = response.headers.getSetCookie();
    assert.equal(cookies.length, 2);
    assert.ok(cookies.every((line) => line.includes("HttpOnly") && line.includes("SameSite=Lax")));
    assert.ok(cookies.some((line) => line.startsWith(`${ACCESS_TOKEN_COOKIE}=`)));
    assert.ok(cookies.some((line) => line.startsWith(`${REFRESH_TOKEN_COOKIE}=`)));
  });

  it("login answers 422 with the invalid field", async () => {
    const response = await post("/auth/login", {}, { email: "nope", password: "" });
    const body = (await response.json()) as Body & { field?: string };
    assert.equal(response.status, 422);
    assert.equal(body.code, "VALIDATION");
    assert.equal(body.field, "email");
  });

  it("refresh swaps a refresh token for a new pair, and rejects an access token", async () => {
    const ok = await post("/auth/refresh", { cookie: `${REFRESH_TOKEN_COOKIE}=${signToken("user-1", "refresh", 600)}` });
    assert.equal(ok.status, 200);
    assert.equal(ok.headers.getSetCookie().length, 2);
    const wrongType = await post("/auth/refresh", { cookie: `${REFRESH_TOKEN_COOKIE}=${signToken("user-1", "access", 600)}` });
    assert.equal(wrongType.status, 401);
    assert.equal((await post("/auth/refresh", {})).status, 401);
  });

  it("an expired or tampered access token is a 401", async () => {
    const expired = signToken("user-1", "access", 900, Date.now() - 2 * 900 * 1000);
    for (const token of [expired, `${signToken("user-1", "access", 900)}x`, "garbage"]) {
      const { status } = await call("GET", "/session", { auth: false, cookie: `${ACCESS_TOKEN_COOKIE}=${token}` });
      assert.equal(status, 401, token.slice(0, 12));
    }
  });

  it("logout clears both cookies", async () => {
    const response = await post("/auth/logout", signedIn);
    assert.deepEqual(
      response.headers.getSetCookie().map((line) => line.includes("Max-Age=0")),
      [true, true],
    );
  });
});

describe("router", () => {
  it("answers 404 for an unknown path", async () => {
    const { status, body } = await call("GET", "/nope");
    assert.equal(status, 404);
    assert.equal(body.code, "NOT_FOUND");
  });

  it("answers 405 when the path exists for another method", async () => {
    const { status, body } = await call("DELETE", "/session");
    assert.equal(status, 405);
    assert.equal(body.code, "METHOD_NOT_ALLOWED");
  });

  it("wraps results in the success envelope", async () => {
    const { status, body } = await call("GET", "/session");
    assert.equal(status, 200);
    assert.equal(body.success, true);
  });
});

describe("401 without a session", () => {
  for (const [method, path] of [
    ["GET", "/session"],
    ["GET", "/organizations"],
    ["GET", "/menu/common"],
    ["GET", "/profiles/me"],
    ["GET", "/notifications"],
    ["POST", "/notifications/read"],
    ["GET", "/records"], // demo
    ["POST", "/staff"], // demo
  ] as const) {
    it(`${method} ${path}`, async () => {
      const { status, body } = await call(method, path, { auth: false, body: method === "POST" ? {} : undefined });
      assert.equal(status, 401);
      assert.equal(body.code, "UNAUTHENTICATED");
    });
  }
});

describe("public endpoints", () => {
  it("lists public organizations without a session", async () => {
    const { status, body } = await call("GET", "/public/organizations", { auth: false });
    assert.equal(status, 200);
    assert.ok(Array.isArray(body.results) && body.results.length > 0);
  });

  it("404 for an unknown public organization", async () => {
    const { status, body } = await call("GET", "/public/organizations/hospital/does-not-exist", { auth: false });
    assert.equal(status, 404);
    assert.equal(body.code, "NOT_FOUND");
  });
});

describe("menus", () => {
  it("403 for an organization the user does not belong to", async () => {
    const { status, body } = await call("GET", "/organizations/not-mine/menu");
    assert.equal(status, 403);
    assert.equal(body.code, "FORBIDDEN");
  });

  it("returns the menu of the user's organization", async () => {
    const orgs = (await call("GET", "/organizations")).body.results as { id: string }[];
    const { status, body } = await call("GET", `/organizations/${orgs[0].id}/menu`);
    assert.equal(status, 200);
    assert.ok(Array.isArray(body.results));
  });
});

// demo:start
describe("records", () => {
  it("pages the list and reports meta", async () => {
    const { body } = await call("GET", "/records?pageSize=3");
    assert.equal((body.results as unknown[]).length, 3);
    assert.equal(body.meta?.pageSize, 3);
    assert.equal(body.meta?.page, 1);
    assert.equal(body.meta?.totalPages, Math.ceil((body.meta?.total ?? 0) / 3));
  });

  it("clamps an out-of-range page and page size", async () => {
    const { body } = await call("GET", "/records?page=9999&pageSize=100000");
    assert.equal(body.meta?.pageSize, 100);
    assert.equal(body.meta?.page, body.meta?.totalPages);
  });

  it("filters by text", async () => {
    const all = (await call("GET", "/records?pageSize=100")).body.results as { name: string }[];
    const needle = all[0].name.slice(0, 4).toLowerCase();
    const { body } = await call("GET", `/records?pageSize=100&q=${needle}`);
    const names = body.results as { name: string }[];
    assert.ok(names.length > 0 && names.every((r) => r.name.toLowerCase().includes(needle)));
  });
});
// demo:end

describe("notifications", () => {
  it("400 when ids is not a list of strings", async () => {
    const { status, body } = await call("POST", "/notifications/read", { body: { ids: [1] } });
    assert.equal(status, 400);
    assert.equal(body.code, "BAD_REQUEST");
  });

  it("marks one read, then all read", async () => {
    type Item = { id: string; unread: boolean };
    const first = ((await call("GET", "/notifications")).body.results as Item[]).find((n) => n.unread);
    assert.ok(first, "sample data has an unread notification");
    const one = (await call("POST", "/notifications/read", { body: { ids: [first.id] } })).body.results as Item[];
    assert.equal(one.find((n) => n.id === first.id)?.unread, false);
    const all = (await call("POST", "/notifications/read", { body: {} })).body.results as Item[];
    assert.ok(all.every((n) => !n.unread));
  });
});

// demo:start
describe("staff", () => {
  it("422 VALIDATION for an invalid body", async () => {
    const { status, body } = await call("POST", "/staff", { body: { name: "x", email: "bad", notes: "", notify: true } });
    assert.equal(status, 422);
    assert.equal(body.code, "VALIDATION");
  });

  it("201 with an id for a valid body", async () => {
    const { status, body } = await call("POST", "/staff", {
      body: { name: "Ada Lovelace", email: "ada@example.com", notes: "", notify: false },
    });
    assert.equal(status, 201);
    assert.equal((body.results as { name: string }).name, "Ada Lovelace");
  });
});
// demo:end
