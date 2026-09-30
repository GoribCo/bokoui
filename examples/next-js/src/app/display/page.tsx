import type { Metadata } from "next";
import { Avatar, Badge, Button, Card, CardFooter, CardHeader, Divider, Heading, Image, Text, actions, colors, sizes } from "bokoui/react";
import { Page, PageHeader, Section } from "@/components/section";

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
    </Page>
  );
}
