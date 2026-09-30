import { Button, Input, actions, colors, sizes, variants } from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

const SearchIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" strokeLinecap="round" />
  </svg>
);

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Button &amp; Input</h1>

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
