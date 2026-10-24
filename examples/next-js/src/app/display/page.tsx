import type { Metadata } from "next";
import { Avatar, Badge, Button, Card, CardFooter, CardHeader, Divider, EmptyState, Heading, Image, Stepper, Tag, Text, actions, colors, sizes } from "bokoui/react";
import { Inbox, SearchX } from "lucide-react";
import { Page, PageHeader, Section } from "@/components/section";
import { PropTables } from "@/components/prop-table";

export const metadata: Metadata = { title: "Data display · UI Framework" };

/** Inline SVG so the demo needs no network or asset files. */
const art = (from: string, to: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="640" height="480" fill="url(#g)"/></svg>`,
  )}`;

const people = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson"];

export default function DisplayPage() {
  return (
    <Page>
      <PageHeader title="Data display" description="Badge, Avatar, Card, Divider and Image share the same tones and radii as the rest of the kit." />

      <Section title="Badge: variant x color">
        {(["soft", "solid", "outline"] as const).map((variant) => (
          <div key={variant} className="flex flex-wrap items-center gap-3">
            <span className="w-16 text-sm text-muted-foreground">{variant}</span>
            {colors.map((color) => (
              <Badge key={color} variant={variant} color={color}>
                {color}
              </Badge>
            ))}
            {actions.map((action) => (
              <Badge key={action} variant={variant} action={action}>
                {action}
              </Badge>
            ))}
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-3">
          {sizes.map((size) => (
            <Badge key={size} size={size}>
              Size {size}
            </Badge>
          ))}
        </div>
      </Section>

      <Section title="Avatar" note="Initials show behind the image, so a slow or missing photo still looks right.">
        <div className="flex flex-wrap items-center gap-4">
          {people.map((name, i) => (
            <Avatar key={name} name={name} color={(["primary", "secondary", "accent", "neutral"] as const)[i]} />
          ))}
          <Avatar name="Grace Hopper" src={art("#6366f1", "#ec4899")} />
          <Avatar name="Alan Turing" src={art("#10b981", "#0ea5e9")} shape="square" />
          <Avatar name="Online" status />
          <Avatar name="Away" status statusAction="warning" />
          <Avatar name="Busy" status statusAction="danger" />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {sizes.map((size) => (
            <Avatar key={size} size={size} name="Ada Lovelace" />
          ))}
        </div>
      </Section>

      <Section title="Divider">
        <div className="flex flex-col gap-4">
          <Text>Above</Text>
          <Divider />
          <Text>Below</Text>
          <Divider label="or continue with" />
          <div className="flex h-8 items-center gap-4">
            <Text>Docs</Text>
            <Divider orientation="vertical" />
            <Text>Blog</Text>
            <Divider orientation="vertical" />
            <Text>Contact</Text>
          </div>
        </div>
      </Section>

      <Section title="Card">
        <div className="grid gap-4 sm:grid-cols-3">
          {(["outline", "elevated", "filled"] as const).map((variant) => (
            <Card key={variant} variant={variant}>
              <CardHeader>
                <Heading as="h3" size="md">
                  {variant}
                </Heading>
                <Text variant="small" muted>
                  A short description of the card.
                </Text>
              </CardHeader>
              <Text variant="small">Body content sits between header and footer.</Text>
              <CardFooter>
                <Button size="sm">Action</Button>
                <Button size="sm" variant="ghost" color="neutral">
                  Cancel
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {(["sm", "md", "lg"] as const).map((padding) => (
            <Card key={padding} padding={padding}>
              <Text variant="small">padding: {padding}</Text>
            </Card>
          ))}
        </div>
        <Card interactive tabIndex={0} role="button" aria-label="Interactive card" className="max-w-sm">
          <Heading as="h3" size="md">
            Interactive card
          </Heading>
          <Text variant="small" muted>
            Hovers and shifts using the style&apos;s hover tokens.
          </Text>
        </Card>
        <Card padding="none" className="max-w-sm">
          <Image src={art("#f59e0b", "#ef4444")} alt="Sunset gradient" aspect="video" className="rounded-none" />
          <div className="flex flex-col gap-1 p-4">
            <Heading as="h3" size="md">
              Media card
            </Heading>
            <Text variant="small" muted>
              Padding none lets the image reach the edge.
            </Text>
          </div>
        </Card>
      </Section>

      <Section title="Image">
        <div className="grid gap-4 sm:grid-cols-4">
          {(["auto", "square", "video", "portrait"] as const).map((aspect) => (
            <div key={aspect} className="flex flex-col gap-2">
              <Image src={art("#8b5cf6", "#06b6d4")} alt={`${aspect} aspect`} aspect={aspect} rounded />
              <Text variant="caption" muted>
                aspect: {aspect}
              </Text>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Tag" note="Chips for user-managed values. Badge is for static status. Removable and filter tags take handlers, so use them from client components (see Forms).">
        <div className="flex flex-col gap-3">
          {(["soft", "outline", "solid"] as const).map((variant) => (
            <div key={variant} className="flex flex-wrap items-center gap-2">
              <span className="w-16 text-sm text-muted-foreground">{variant}</span>
              {colors.map((color) => (
                <Tag key={color} variant={variant} color={color}>
                  {color}
                </Tag>
              ))}
              <Tag variant={variant} action="danger">
                danger
              </Tag>
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-2">
            {sizes.map((size) => (
              <Tag key={size} size={size}>
                Size {size}
              </Tag>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Stepper" note="Presentational: you own the current step. Completed steps are announced to screen readers.">
        <div className="flex flex-col gap-10">
          <Stepper
            aria-label="Checkout"
            current={1}
            steps={[
              { label: "Account", description: "Your details" },
              { label: "Plan", description: "Choose a tier" },
              { label: "Payment", description: "Card or invoice" },
              { label: "Done" },
            ]}
          />
          <div className="grid gap-8 sm:grid-cols-2">
            <Stepper
              aria-label="Vertical steps"
              orientation="vertical"
              current={2}
              action="success"
              steps={[{ label: "Ordered", description: "Sep 30" }, { label: "Packed", description: "Oct 1" }, { label: "Shipped", description: "In transit" }, { label: "Delivered" }]}
            />
            <Stepper aria-label="Finished" current={3} color="accent" steps={[{ label: "One" }, { label: "Two" }, { label: "Three" }]} />
          </div>
        </div>
      </Section>

      <Section title="Empty state">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card padding="none">
            <EmptyState
              icon={<Inbox aria-hidden="true" />}
              title="No messages yet"
              description="When someone writes to you, it shows up here."
              actions={<Button size="sm">Compose message</Button>}
            />
          </Card>
          <Card padding="none">
            <EmptyState
              icon={<SearchX aria-hidden="true" />}
              title="No results for “xyzzy”"
              description="Check the spelling or try a broader search."
              actions={
                <Button size="sm" variant="outline">
                  Clear filters
                </Button>
              }
            />
          </Card>
        </div>
      </Section>

      <Section title="API" note="Generated from the package's TypeScript types. Every component also accepts standard HTML attributes and className.">
        <PropTables names={["Badge", "Avatar", "Card", "CardHeader", "Divider", "Image", "Tag", "Stepper", "EmptyState"]} />
      </Section>
    </Page>
  );
}
