import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DASHBOARD_PATH } from "@/lib/config/auth";
import { organizationSegments } from "@/lib/organization/organization-types";
import { isPublicPath, safeReturnPath } from "@/lib/auth/paths";

describe("safeReturnPath", () => {
  it("keeps same-site relative paths", () => {
    assert.equal(safeReturnPath("/profile"), "/profile");
    assert.equal(safeReturnPath("/a/b?x=1#h"), "/a/b?x=1#h");
  });

  it("falls back to the dashboard for missing or empty values", () => {
    assert.equal(safeReturnPath(null), DASHBOARD_PATH);
    assert.equal(safeReturnPath(undefined), DASHBOARD_PATH);
    assert.equal(safeReturnPath(""), DASHBOARD_PATH);
  });

  it("rejects absolute, protocol-relative and backslash URLs", () => {
    for (const value of ["https://evil.com", "//evil.com", "/\\evil.com", "javascript:alert(1)", "evil"]) {
      assert.equal(safeReturnPath(value), DASHBOARD_PATH, value);
    }
  });
});

describe("isPublicPath", () => {
  it("allows the landing page and public prefixes with their children", () => {
    assert.equal(isPublicPath("/"), true);
    assert.equal(isPublicPath("/sign-in"), true);
    assert.equal(isPublicPath("/legal/terms"), true);
  });

  it("allows organization profile routes", () => {
    const segment = organizationSegments[0];
    assert.equal(isPublicPath(`/${segment}/some-slug`), true);
  });

  it("protects the app routes and does not match partial segments", () => {
    assert.equal(isPublicPath("/dashboard"), false);
    assert.equal(isPublicPath("/legalese"), false);
    assert.equal(isPublicPath("/sign-in-now"), false);
  });
});
