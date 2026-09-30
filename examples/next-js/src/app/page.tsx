import { Search } from "lucide-react";
import { Button, Heading, Input, Link, Text, actions, colors, sizes, variants } from "bokoui";

function Section({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="flex flex-col gap-4">
      <Heading as="h2" size="lg">{title}</Heading>
      {children}
    </section>
  );
}

const SearchIcon = <Search aria-hidden="true" />;

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-10">
      <Heading as="h1">Button, Input &amp; Typography</Heading>

      <Section title="Button: variant x color">
        {variants.map((variant) => (
          <div key={variant} className="flex flex-wrap items-center gap-3">
            <span className="w-16 text-sm text-muted-foreground">{variant}</span>
            {colors.map((color) => (
              <Button key={color} variant={variant} color={color}>
                {color}
              </Button>
            ))}
          </div>
        ))}
      </Section>

      <Section title="Button: action (overrides color)">
        {(["solid", "outline", "soft"] as const).map((variant) => (
          <div key={variant} className="flex flex-wrap items-center gap-3">
            <span className="w-16 text-sm text-muted-foreground">{variant}</span>
            {actions.map((action) => (
              <Button key={action} variant={variant} action={action}>
                {action}
              </Button>
            ))}
          </div>
        ))}
      </Section>

      <Section title="Button: sizes, icons, states">
        <div className="flex flex-wrap items-center gap-3">
          {sizes.map((size) => (
            <Button key={size} size={size}>
              Size {size}
            </Button>
          ))}
          {sizes.map((size) => (
            <Button key={size} size={size} iconOnly aria-label={`Search ${size}`}>
              {SearchIcon}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button leftIcon={SearchIcon}>Left icon</Button>
          <Button variant="outline" rightIcon={SearchIcon}>
            Right icon
          </Button>
          <Button loading>Loading</Button>
          <Button variant="soft" loading>
            Saving
          </Button>
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>
            Disabled
          </Button>
          <Button className="rounded-full">rounded-full override</Button>
        </div>
        <Button fullWidth variant="outline">
          Full width
        </Button>
      </Section>

      <Section title="Input: variants and sizes">
        <div className="grid gap-4 sm:grid-cols-3">
          <Input variant="outline" placeholder="Outline" aria-label="Outline" />
          <Input variant="filled" placeholder="Filled" aria-label="Filled" />
          <Input variant="flushed" placeholder="Flushed" aria-label="Flushed" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {sizes.map((size) => (
            <Input key={size} size={size} placeholder={`Size ${size}`} aria-label={`Size ${size}`} />
          ))}
        </div>
      </Section>

      <Section title="Input: states and adornments">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input placeholder="Search" aria-label="Search" startAdornment={SearchIcon} />
          <Input variant="flushed" placeholder="Search" aria-label="Search flushed" startAdornment={SearchIcon} />
          <Input invalid defaultValue="not-an-email" aria-label="Invalid" endAdornment={SearchIcon} />
          <Input color="accent" placeholder="Accent focus" aria-label="Accent" />
          <Input disabled placeholder="Disabled" aria-label="Disabled" />
          <Input readOnly defaultValue="Read only" aria-label="Read only" />
          <Input type="password" placeholder="Password" aria-label="Password" />
          <Input type="file" aria-label="File" />
        </div>
      </Section>

      <Section title="Responsive props (resize the window)">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <Button id="resp-button" size={{ base: "sm", md: "lg" }} fullWidth={{ base: true, md: false }}>
            sm on mobile, lg from md
          </Button>
          <Input id="resp-input" size={{ base: "sm", md: "lg" }} placeholder="sm on mobile, lg from md" aria-label="Responsive" />
        </div>
      </Section>

      <Section title="Typography" id="typography">
        <div className="flex flex-col gap-3">
          <Heading as="h1">Heading 1</Heading>
          <Heading as="h2">Heading 2</Heading>
          <Heading as="h3">Heading 3</Heading>
          <Heading as="h4">Heading 4</Heading>
          <Heading as="h5">Heading 5</Heading>
          <Heading as="h6">Heading 6</Heading>
          <Text variant="lead" muted>
            Lead paragraph: the font, weight, tracking and case all follow the active style.
          </Text>
          <Text>
            Body text with a <Link href="#typography">regular link</Link>, an{" "}
            <Link href="https://tailwindcss.com" external>
              external link
            </Link>{" "}
            and <Text as="span" variant="code">inline code</Text>.
          </Text>
          <Text variant="small">Small text</Text>
          <Text variant="caption" muted>Caption text</Text>
          <div className="flex flex-wrap gap-4">
            <Link href="#typography" underline="always">Always underlined</Link>
            <Link href="#typography" color="accent">Accent</Link>
            <Link href="#typography" action="danger" underline="none">Danger, no underline</Link>
          </div>
        </div>
      </Section>

      <Section title="Form example">
        <form className="flex max-w-sm flex-col gap-3">
          <Input type="email" placeholder="you@example.com" aria-label="Email" />
          <div className="flex gap-2">
            <Button type="submit">Subscribe</Button>
            <Button type="reset" variant="ghost" color="neutral">
              Reset
            </Button>
          </div>
        </form>
      </Section>
    </main>
  );
}
