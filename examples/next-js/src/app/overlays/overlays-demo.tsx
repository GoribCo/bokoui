"use client";

import { useState } from "react";
import { Copy, Pencil, Trash2 } from "lucide-react";
import { Button, Checkbox, Input, FormField, Text } from "bokoui/react";
import { Drawer, Menu, MenuItem, MenuLabel, MenuSeparator, Modal, Popover, Tooltip } from "bokoui/react/client";

export function ModalDemo() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [big, setBig] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Button variant="outline" action="danger" onClick={() => setConfirm(true)}>
        Delete project…
      </Button>
      <Button variant="soft" onClick={() => setBig(true)}>
        Large, scrolling
      </Button>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Edit profile"
        description="Escape, the × button and a backdrop click all close it. Focus returns to the button."
        footer={
          <>
            <Button variant="ghost" color="neutral" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </>
        }
      >
        <FormField label="Display name">
          <Input defaultValue="Ada Lovelace" autoFocus />
        </FormField>
      </Modal>

      <Modal
        open={confirm}
        onOpenChange={setConfirm}
        size="sm"
        title="Delete project?"
        closeOnBackdrop={false}
        showClose={false}
        footer={
          <>
            <Button variant="ghost" color="neutral" onClick={() => setConfirm(false)}>
              Keep it
            </Button>
            <Button action="danger" onClick={() => setConfirm(false)}>
              Delete
            </Button>
          </>
        }
      >
        <Text>This cannot be undone. The backdrop does not close this one.</Text>
      </Modal>

      <Modal open={big} onOpenChange={setBig} size="lg" title="Long content">
        <div className="flex flex-col gap-3">
          {Array.from({ length: 24 }, (_, i) => (
            <Text key={i}>Paragraph {i + 1}: the body scrolls while the header stays put and the page behind does not move.</Text>
          ))}
        </div>
      </Modal>
    </div>
  );
}

export function TooltipDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4 py-8">
      <Tooltip content="Top (default)">
        <Button variant="outline">Top</Button>
      </Tooltip>
      <Tooltip content="Placed below" placement="bottom">
        <Button variant="outline">Bottom</Button>
      </Tooltip>
      <Tooltip content="On the left" placement="left">
        <Button variant="outline">Left</Button>
      </Tooltip>
      <Tooltip content="On the right" placement="right">
        <Button variant="outline">Right</Button>
      </Tooltip>
      <Tooltip content="No delay" delay={0}>
        <Button variant="soft">Instant</Button>
      </Tooltip>
      <Tooltip content="Tooltips also describe icon-only buttons">
        <Button iconOnly aria-label="Copy" variant="ghost">
          <Copy aria-hidden="true" />
        </Button>
      </Tooltip>
      <Tooltip content="Never shown" disabled>
        <Button variant="ghost">Disabled tooltip</Button>
      </Tooltip>
    </div>
  );
}

export function MenuDemo() {
  const [last, setLast] = useState("nothing yet");
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Menu trigger={<Button variant="outline">Options</Button>}>
        <MenuLabel>Actions</MenuLabel>
        <MenuItem onSelect={() => setLast("Edit")}>
          <Pencil aria-hidden="true" /> Edit
        </MenuItem>
        <MenuItem onSelect={() => setLast("Duplicate")}>
          <Copy aria-hidden="true" /> Duplicate
        </MenuItem>
        <MenuItem disabled>Archive (disabled)</MenuItem>
        <MenuSeparator />
        <MenuItem danger onSelect={() => setLast("Delete")}>
          <Trash2 aria-hidden="true" /> Delete
        </MenuItem>
      </Menu>
      <Menu trigger={<Button>Stays open</Button>} placement="bottom-end">
        <MenuItem onSelect={(e) => (e.preventDefault(), setLast("Toggle (menu stayed open)"))}>Toggle something</MenuItem>
        <MenuItem onSelect={() => setLast("Close")}>Close</MenuItem>
      </Menu>
      <Text variant="small" muted>
        Last selected: {last}
      </Text>
    </div>
  );
}

export function PopoverDemo() {
  const [n, setN] = useState(0);
  return (
    <div className="flex flex-wrap items-center gap-4 py-2">
      <Popover trigger={<Button variant="outline">Share</Button>} aria-label="Share this page" placement="bottom-start">
        <div className="flex flex-col gap-3">
          <Text className="font-medium">Share this page</Text>
          <Input aria-label="Link" readOnly defaultValue="https://example.com/p/42" />
          <Button size="sm" onClick={() => setN((v) => v + 1)}>
            Copy link {n > 0 && `(${n})`}
          </Button>
        </div>
      </Popover>
      <Popover trigger={<Button variant="soft">Filters</Button>} aria-label="Filters" placement="bottom">
        <div className="flex flex-col gap-2">
          <Checkbox label="In stock" defaultChecked />
          <Checkbox label="On sale" />
          <Checkbox label="Free shipping" />
        </div>
      </Popover>
      <Popover trigger={<Button variant="ghost">What is this?</Button>} aria-label="Explanation" placement="right">
        <Text variant="small">A popover holds anything, unlike a menu. It is not modal: Tab out or press Escape to close it.</Text>
      </Popover>
    </div>
  );
}

export function DrawerDemo() {
  const [side, setSide] = useState<"right" | "left" | "top" | "bottom" | null>(null);
  return (
    <div className="flex flex-wrap items-center gap-3">
      {(["right", "left", "top", "bottom"] as const).map((s) => (
        <Button key={s} variant="outline" onClick={() => setSide(s)}>
          {s === "bottom" ? "Bottom sheet" : `${s[0].toUpperCase()}${s.slice(1)} drawer`}
        </Button>
      ))}
      <Drawer
        open={side !== null}
        onOpenChange={(o) => !o && setSide(null)}
        side={side ?? "right"}
        size="sm"
        title="Filters"
        description="A modal anchored to an edge: same focus trap, Escape and backdrop behavior."
        footer={
          <>
            <Button variant="ghost" color="neutral" onClick={() => setSide(null)}>
              Reset
            </Button>
            <Button onClick={() => setSide(null)}>Apply</Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <Checkbox label="In stock" defaultChecked />
          <Checkbox label="On sale" />
          <Checkbox label="Free shipping" />
        </div>
      </Drawer>
    </div>
  );
}
