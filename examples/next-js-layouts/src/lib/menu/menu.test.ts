import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { findActiveTrail, flattenMenu, isPathActive } from "@/lib/menu";
import { filterMenuByRoles } from "@/lib/menu/filter";
import type { MenuGroup } from "@/lib/types";

const groups: MenuGroup[] = [
  {
    id: "main",
    label: "Main",
    items: [
      { id: "home", label: "Home", href: "/dashboard" },
      {
        id: "patients",
        label: "Patients",
        href: "/patients",
        children: [
          { id: "list", label: "List", href: "/patients/list" },
          { id: "records", label: "Records", href: "/patients/records", requiredRoles: ["doctor"] },
        ],
      },
      {
        id: "admin-group",
        label: "Admin",
        requiredRoles: ["admin"],
        children: [{ id: "users", label: "Users", href: "/admin/users", requiredRoles: ["admin"] }],
      },
    ],
  },
  { id: "secret", label: "Secret", requiredRoles: ["admin"], items: [{ id: "s1", label: "S1", href: "/secret" }] },
];

describe("filterMenuByRoles", () => {
  it("hides items and groups the roles do not allow", () => {
    const result = filterMenuByRoles(groups, ["manager"]);
    assert.deepEqual(result.map((g) => g.id), ["main"]);
    const ids = flattenMenu(result).map((e) => e.item.id);
    assert.deepEqual(ids, ["home", "patients", "list"]);
  });

  it("keeps role-gated children for matching roles", () => {
    const result = filterMenuByRoles(groups, ["doctor"]);
    assert.deepEqual(flattenMenu(result).map((e) => e.item.id), ["home", "patients", "list", "records"]);
  });

  it("drops a pure group whose children are all hidden", () => {
    const result = filterMenuByRoles(groups, ["doctor"]);
    assert.equal(flattenMenu(result).some((e) => e.item.id === "admin-group"), false);
  });

  it("keeps an item with its own link when children are hidden, without a children array", () => {
    const only: MenuGroup[] = [
      { id: "g", label: "G", items: [{ id: "p", label: "P", href: "/p", children: [{ id: "c", label: "C", href: "/c", requiredRoles: ["admin"] }] }] },
    ];
    const [group] = filterMenuByRoles(only, []);
    assert.equal(group.items[0].children, undefined);
  });

  it("shows everything to admin", () => {
    const ids = flattenMenu(filterMenuByRoles(groups, ["admin"])).map((e) => e.item.id);
    assert.ok(ids.includes("users") && ids.includes("s1"));
  });

  it("returns nothing for an empty menu", () => {
    assert.deepEqual(filterMenuByRoles([], ["admin"]), []);
  });
});

describe("flattenMenu", () => {
  it("lists items depth first with depth and parent ids", () => {
    const flat = flattenMenu(groups);
    const records = flat.find((e) => e.item.id === "records");
    assert.equal(records?.depth, 1);
    assert.deepEqual(records?.parentIds, ["patients"]);
    assert.equal(records?.group.id, "main");
    assert.equal(flat[0].item.id, "home");
  });
});

describe("findActiveTrail", () => {
  it("finds an exact match with its parent chain", () => {
    const trail = findActiveTrail(groups, "/patients/records");
    assert.deepEqual(trail?.items.map((i) => i.id), ["patients", "records"]);
    assert.equal(trail?.group.id, "main");
  });

  it("falls back to the longest segment prefix", () => {
    const trail = findActiveTrail(groups, "/patients/list/42");
    assert.deepEqual(trail?.items.map((i) => i.id), ["patients", "list"]);
  });

  it("ignores a trailing slash", () => {
    assert.equal(findActiveTrail(groups, "/dashboard/")?.items[0].id, "home");
  });

  it("does not match a partial segment", () => {
    assert.equal(findActiveTrail(groups, "/patientsx"), null);
  });

  it("returns null when nothing matches", () => {
    assert.equal(findActiveTrail(groups, "/nowhere"), null);
  });
});

describe("isPathActive", () => {
  it("matches the path and its parents, not siblings", () => {
    assert.equal(isPathActive("/patients", "/patients"), true);
    assert.equal(isPathActive("/patients", "/patients/list"), true);
    assert.equal(isPathActive("/patients", "/patients-old"), false);
  });

  it("does not treat the root as a prefix of everything", () => {
    assert.equal(isPathActive("/", "/dashboard"), false);
    assert.equal(isPathActive("/", "/"), true);
  });
});
