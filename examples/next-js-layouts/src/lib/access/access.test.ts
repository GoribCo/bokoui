import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { can, effectiveRoles, hasAnyRole, hasRole } from "@/lib/access";
import type { Organization } from "@/lib/types";

const org = (id: string, roles: Organization["roles"]) => ({ id, roles }) as Organization;

describe("hasRole / hasAnyRole", () => {
  it("hasRole checks membership", () => {
    assert.equal(hasRole(["admin"], "admin"), true);
    assert.equal(hasRole(["admin"], "doctor"), false);
  });

  it("hasAnyRole allows everyone when nothing is required", () => {
    assert.equal(hasAnyRole([], undefined), true);
    assert.equal(hasAnyRole([], []), true);
  });

  it("hasAnyRole needs at least one matching role", () => {
    assert.equal(hasAnyRole(["manager"], ["admin", "manager"]), true);
    assert.equal(hasAnyRole(["doctor"], ["admin", "manager"]), false);
    assert.equal(hasAnyRole([], ["admin"]), false);
  });
});

describe("can", () => {
  it("follows the role templates through the evaluator", () => {
    assert.equal(can(["admin"], "organization.access.view"), true);
    assert.equal(can(["auditor"], "organization.access.view"), true);
    assert.equal(can(["doctor"], "organization.access.view"), false);
    assert.equal(can(["doctor"], "organization.reports.view"), true);
  });

  it("grants nothing for no roles or an unknown role", () => {
    assert.equal(can([], "organization.dashboard.view"), false);
    assert.equal(can(["nobody"], "organization.dashboard.view"), false);
  });

  it("a personal permission is not an organization permission", () => {
    assert.equal(can(["admin"], "personal.profile.manage"), false);
  });
});

describe("effectiveRoles", () => {
  const orgs = [org("a", ["admin", "doctor"]), org("b", ["manager"]), org("a", ["doctor", "auditor"])];

  it("is the de-duplicated union of roles in one organization", () => {
    assert.deepEqual(effectiveRoles(orgs, "a").sort(), ["admin", "auditor", "doctor"]);
  });

  it("is empty when the user is not a member", () => {
    assert.deepEqual(effectiveRoles(orgs, "zzz"), []);
  });
});
