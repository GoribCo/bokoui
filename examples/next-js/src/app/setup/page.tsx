import type { Metadata } from "next";
import { CodeBlock, Page, PageHeader, Section } from "@/components/section";

export const metadata: Metadata = { title: "Setup · UI Framework" };

const globalsCss = `@import "tailwindcss";
@import "bokoui/styles.css";`;

const layout = `import { ThemeProvider, ThemeSwitcher } from "bokoui/react/theme";
import { ThemeScript } from "bokoui/react/theme-script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="flat" data-mode="light" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>
          <ThemeSwitcher />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}`;

const usage = `import { Button, Input } from "bokoui/react";

<Button color="primary" variant="outline" size="lg">Save</Button>
<Button action="danger" loading>Deleting</Button>
<Input placeholder="Email" invalid />`;

export default function SetupPage() {
  return (
    <Page>
      <PageHeader title="Setup" description="Install bokoui and set it up in a new Next.js (React) app in four steps." />

      <Section title="1. Install" note="Needs Tailwind CSS 4.1+ and React 19 (Next.js create-next-app with Tailwind gives you both).">
        <CodeBlock label="Install">{`npm i bokoui`}</CodeBlock>
      </Section>

      <Section title="2. Import the stylesheet" note="In app/globals.css, after Tailwind. It also registers the package for class scanning.">
        <CodeBlock label="globals.css">{globalsCss}</CodeBlock>
      </Section>

      <Section title="3. Add the provider" note="ThemeScript must stay in the head: it sets the saved style and mode before first paint, so there is no flash.">
        <CodeBlock label="app/layout.tsx">{layout}</CodeBlock>
      </Section>

      <Section title="4. Use components" note="Import from bokoui/react in server and client files alike. Only stateful components are client components.">
        <CodeBlock label="Usage">{usage}</CodeBlock>
      </Section>

      <Section title="Pick a style" note="Style (data-theme) and mode (data-mode) are independent. Use the switcher in the sidebar to try all 20 styles.">
        <CodeBlock label="Styles">{`<html data-theme="glassmorphism" data-mode="dark">`}</CodeBlock>
      </Section>
    </Page>
  );
}
