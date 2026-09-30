"use client";

import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, KeyRound, Mail } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardFooter,
  CardHeader,
  Checkbox,
  Divider,
  EmptyState,
  FormField,
  Grid,
  Heading,
  Inline,
  Input,
  Progress,
  Slider,
  Stack,
  Stepper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
  Textarea,
} from "bokoui/react";
import { Select, useToast } from "bokoui/react/client";

const box = "flex h-12 items-center justify-center rounded-control bg-(--tone-soft) text-sm text-(--tone-ink)";

/** Stack, Inline, Grid and Container arrange children; they set no colors. */
export function LayoutDemo() {
  return (
    <div className="flex flex-col gap-8" data-tone="primary">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Text variant="small" muted>
            <code>{"<Stack gap={3}>"}</code>
          </Text>
          <Stack gap={3} className="rounded-card border border-border p-3">
            <div className={box}>1</div>
            <div className={box}>2</div>
            <div className={box}>3</div>
          </Stack>
        </div>
        <div className="flex flex-col gap-2">
          <Text variant="small" muted>
            <code>{'<Inline gap={2} justify="between">'}</code> wraps on narrow screens
          </Text>
          <Inline gap={2} justify="between" className="rounded-card border border-border p-3">
            <div className={`${box} w-24`}>Left</div>
            <div className={`${box} w-24`}>Middle</div>
            <div className={`${box} w-24`}>Right</div>
          </Inline>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Text variant="small" muted>
          <code>{'<Grid cols="auto">'}</code> fits as many 16rem columns as the width allows
        </Text>
        <Grid cols="auto" gap={3}>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className={box}>
              Cell {i + 1}
            </div>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export function LoginPattern() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  return (
    <Card padding="lg" className="mx-auto w-full max-w-sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            toast({ title: "Signed in", description: "Welcome back.", action: "success" });
          }, 1200);
        }}
      >
        <Stack gap={5}>
          <Stack gap={1}>
            <Heading as="h3" size="lg">
              Sign in
            </Heading>
            <Text variant="small" muted>
              Use your work email to continue.
            </Text>
          </Stack>
          <FormField label="Email" required>
            <Input type="email" name="email" placeholder="you@company.com" autoComplete="email" required />
          </FormField>
          <FormField label="Password" required hint="At least 8 characters">
            <Input type="password" name="password" autoComplete="current-password" minLength={8} required />
          </FormField>
          <Checkbox label="Keep me signed in" name="remember" />
          <Button type="submit" fullWidth loading={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
          <Divider label="or continue with" />
          <Inline gap={2}>
            <Button type="button" variant="outline" color="neutral" className="flex-1" leftIcon={<KeyRound aria-hidden="true" />}>
              Single sign-on
            </Button>
            <Button type="button" variant="outline" color="neutral" className="flex-1" leftIcon={<Mail aria-hidden="true" />}>
              Email link
            </Button>
          </Inline>
        </Stack>
      </form>
    </Card>
  );
}

export function SettingsPattern() {
  const { toast } = useToast();
  const [dirty, setDirty] = useState(false);
  const mark = () => setDirty(true);
  return (
    <form
      className="flex max-w-2xl flex-col gap-4"
      onChange={mark}
      onSubmit={(e) => {
        e.preventDefault();
        setDirty(false);
        toast({ title: "Settings saved", action: "success" });
      }}
    >
      <Card>
        <CardHeader>
          <Heading as="h3" size="md">
            Profile
          </Heading>
          <Text variant="small" muted>
            This is shown on your public page.
          </Text>
        </CardHeader>
        <Grid cols={2} gap={4}>
          <FormField label="Display name">
            <Input defaultValue="Ada Lovelace" />
          </FormField>
          <FormField label="Role">
            <Select
              onValueChange={mark}
              defaultValue="engineer"
              options={[
                { value: "engineer", label: "Engineer" },
                { value: "designer", label: "Designer" },
                { value: "manager", label: "Manager" },
              ]}
            />
          </FormField>
        </Grid>
        <FormField label="Bio" hint="Up to 160 characters">
          <Textarea defaultValue="Wrote the first algorithm intended for a machine." rows={3} />
        </FormField>
      </Card>
      <Card>
        <CardHeader>
          <Heading as="h3" size="md">
            Notifications
          </Heading>
        </CardHeader>
        <Stack gap={3}>
          <Switch label="Email me about activity" defaultChecked />
          <Switch label="Weekly summary" defaultChecked />
          <Switch label="Product news" />
          <FormField label="Quiet hours volume">
            <Slider defaultValue={30} />
          </FormField>
        </Stack>
      </Card>
      <Inline justify="end" gap={2}>
        <Button type="reset" variant="ghost" color="neutral" onClick={() => setDirty(false)} disabled={!dirty}>
          Discard
        </Button>
        <Button type="submit" disabled={!dirty}>
          Save changes
        </Button>
      </Inline>
    </form>
  );
}

const stats = [
  { label: "Revenue", value: "$48.2k", change: "+12.4%", up: true, progress: 72 },
  { label: "New users", value: "1,204", change: "+4.1%", up: true, progress: 48 },
  { label: "Churn", value: "2.3%", change: "-0.6%", up: false, progress: 23 },
  { label: "Tickets open", value: "37", change: "+9", up: false, progress: 61 },
];
const orders = [
  { id: "#1042", customer: "Grace Hopper", status: "paid", total: 129 },
  { id: "#1041", customer: "Alan Turing", status: "pending", total: 59 },
  { id: "#1040", customer: "Katherine Johnson", status: "paid", total: 240 },
  { id: "#1039", customer: "Linus Torvalds", status: "refunded", total: 18 },
];
const statusAction = { paid: "success", pending: "warning", refunded: "danger" } as const;

export function DashboardPattern() {
  const [rows, setRows] = useState(orders);
  return (
    <Stack gap={6}>
      <Grid cols={4} gap={4}>
        {stats.map((s) => (
          <Card key={s.label} padding="md">
            <Inline justify="between" align="start">
              <Text variant="small" muted>
                {s.label}
              </Text>
              <Badge size="sm" action={s.up ? "success" : "danger"}>
                {s.up ? <ArrowUpRight aria-hidden="true" /> : <ArrowDownRight aria-hidden="true" />}
                {s.change}
              </Badge>
            </Inline>
            <p className="text-3xl font-semibold tracking-tight tabular-nums">{s.value}</p>
            <Progress value={s.progress} size="sm" aria-label={`${s.label} progress toward goal`} />
          </Card>
        ))}
      </Grid>
      <Card padding="none">
        <div className="flex items-center justify-between gap-3 p-4">
          <Heading as="h3" size="md">
            Recent orders
          </Heading>
          <Button size="sm" variant="outline" color="neutral" onClick={() => setRows(rows.length ? [] : orders)}>
            {rows.length ? "Clear (see empty state)" : "Restore"}
          </Button>
        </div>
        {rows.length ? (
          <Table aria-label="Recent orders" hoverable wrapperClassName="rounded-none border-x-0 border-b-0">
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead numeric>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.id}</TableCell>
                  <TableCell>{o.customer}</TableCell>
                  <TableCell>
                    <Badge size="sm" action={statusAction[o.status as keyof typeof statusAction]}>
                      {o.status}
                    </Badge>
                  </TableCell>
                  <TableCell numeric>${o.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState title="No orders yet" description="Orders appear here as soon as a customer checks out." actions={<Button size="sm" onClick={() => setRows(orders)}>Load sample orders</Button>} />
        )}
      </Card>
    </Stack>
  );
}

const wizard = [
  { label: "Account", description: "Who are you?" },
  { label: "Plan", description: "Pick a tier" },
  { label: "Review", description: "Check and confirm" },
];

export function WizardPattern() {
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState("pro");
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const last = wizard.length - 1;
  const canNext = step !== 0 || /.+@.+\..+/.test(email);
  return (
    <Card padding="lg" className="max-w-2xl">
      <Stack gap={8}>
        <Stepper steps={wizard} current={step} aria-label="Sign-up progress" />
        <div aria-live="polite">
          {step === 0 && (
            <FormField label="Email" hint="We will send a confirmation link" error={email && !canNext ? "Enter a valid email" : undefined}>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
            </FormField>
          )}
          {step === 1 && (
            <Stack gap={2} role="radiogroup" aria-label="Plan">
              {[
                ["free", "Free", "1 project"],
                ["pro", "Pro", "Unlimited projects, $12/mo"],
                ["team", "Team", "Roles and SSO, $39/mo"],
              ].map(([id, name, desc]) => (
                <label key={id} className="flex cursor-pointer items-start gap-3 rounded-control border border-border p-3 has-[:checked]:border-(--tone) has-[:checked]:bg-(--tone-soft)" data-tone="primary">
                  <input type="radio" name="wizard-plan" value={id} checked={plan === id} onChange={() => setPlan(id)} className="mt-1 accent-(--tone)" />
                  <span className="flex flex-col">
                    <span className="text-sm font-medium">{name}</span>
                    <span className="text-xs text-muted-foreground">{desc}</span>
                  </span>
                </label>
              ))}
            </Stack>
          )}
          {step === 2 && (
            <Stack gap={1}>
              <Text>
                <strong>{email}</strong> on the <strong>{plan}</strong> plan.
              </Text>
              <Text variant="small" muted>
                Press confirm to create your account.
              </Text>
            </Stack>
          )}
        </div>
        <CardFooter>
          <Button variant="ghost" color="neutral" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
          {step < last ? (
            <Button disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
              Continue
            </Button>
          ) : (
            <Button
              action="success"
              onClick={() => {
                toast({ title: "Account created", description: email, action: "success" });
                setStep(0);
                setEmail("");
              }}
            >
              Confirm
            </Button>
          )}
        </CardFooter>
      </Stack>
    </Card>
  );
}
