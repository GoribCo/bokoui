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
  Radio,
  RadioGroup,
  Select,
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
  useTheme,
  useToast,
} from 'bokoui/expo';
import { useState } from 'react';
import { View } from 'react-native';

import { Screen, Section } from '@/components/screen';

function LayoutDemo() {
  const { tokens } = useTheme();
  const box = (label: string, width?: number) => (
    <View
      key={label}
      style={{ height: 48, width, alignItems: 'center', justifyContent: 'center', borderRadius: tokens.radiusControl, backgroundColor: tokens.muted }}>
      <Text variant="small">{label}</Text>
    </View>
  );
  const frame = { borderWidth: tokens.borderWidth, borderColor: tokens.border, borderRadius: tokens.radiusCard, padding: 12 };
  return (
    <Stack gap={6}>
      <Stack gap={2}>
        <Text variant="small" muted>{'<Stack gap={3}>'}</Text>
        <Stack gap={3} style={frame}>
          {['1', '2', '3'].map((n) => box(n))}
        </Stack>
      </Stack>
      <Stack gap={2}>
        <Text variant="small" muted>{'<Inline gap={2} justify="between">'}</Text>
        <Inline gap={2} justify="between" style={frame}>
          {['Left', 'Middle', 'Right'].map((n) => box(n, 80))}
        </Inline>
      </Stack>
      <Stack gap={2}>
        <Text variant="small" muted>{'<Grid cols="auto">'}</Text>
        <Grid cols="auto" gap={3}>
          {Array.from({ length: 6 }, (_, i) => box(`Cell ${i + 1}`))}
        </Grid>
      </Stack>
    </Stack>
  );
}

function LoginPattern() {
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const { toast } = useToast();
  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: 'Signed in', description: 'Welcome back.', action: 'success' });
    }, 1200);
  };
  return (
    <Card padding="lg">
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
          <Input placeholder="you@company.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
        </FormField>
        <FormField label="Password" required hint="At least 8 characters">
          <Input secureTextEntry autoComplete="current-password" />
        </FormField>
        <Checkbox label="Keep me signed in" checked={remember} onCheckedChange={setRemember} />
        <Button fullWidth loading={loading} onPress={submit}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
        <Divider label="or continue with" />
        <Inline gap={2}>
          <Button variant="outline" color="neutral">
            Single sign-on
          </Button>
          <Button variant="outline" color="neutral">
            Email link
          </Button>
        </Inline>
      </Stack>
    </Card>
  );
}

function SettingsPattern() {
  const { toast } = useToast();
  const [dirty, setDirty] = useState(false);
  const [role, setRole] = useState('engineer');
  const [email, setEmail] = useState(true);
  const [weekly, setWeekly] = useState(true);
  const [news, setNews] = useState(false);
  const change = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setDirty(true);
  };
  return (
    <Stack gap={4}>
      <Card>
        <CardHeader>
          <Heading as="h3" size="md">
            Profile
          </Heading>
          <Text variant="small" muted>
            This is shown on your public page.
          </Text>
        </CardHeader>
        <Stack gap={4}>
          <FormField label="Display name">
            <Input defaultValue="Ada Lovelace" onChangeText={() => setDirty(true)} />
          </FormField>
          <FormField label="Role">
            <Select
              value={role}
              onValueChange={change(setRole)}
              options={[
                { value: 'engineer', label: 'Engineer' },
                { value: 'designer', label: 'Designer' },
                { value: 'manager', label: 'Manager' },
              ]}
            />
          </FormField>
          <FormField label="Bio" hint="Up to 160 characters">
            <Textarea defaultValue="Wrote the first algorithm intended for a machine." rows={3} onChangeText={() => setDirty(true)} />
          </FormField>
        </Stack>
      </Card>
      <Card>
        <CardHeader>
          <Heading as="h3" size="md">
            Notifications
          </Heading>
        </CardHeader>
        <Stack gap={3}>
          <Switch label="Email me about activity" checked={email} onCheckedChange={change(setEmail)} />
          <Switch label="Weekly summary" checked={weekly} onCheckedChange={change(setWeekly)} />
          <Switch label="Product news" checked={news} onCheckedChange={change(setNews)} />
          <FormField label="Quiet hours volume">
            <Slider defaultValue={30} onValueChange={() => setDirty(true)} />
          </FormField>
        </Stack>
      </Card>
      <Inline justify="end" gap={2}>
        <Button variant="ghost" color="neutral" disabled={!dirty} onPress={() => setDirty(false)}>
          Discard
        </Button>
        <Button
          disabled={!dirty}
          onPress={() => {
            setDirty(false);
            toast({ title: 'Settings saved', action: 'success' });
          }}>
          Save changes
        </Button>
      </Inline>
    </Stack>
  );
}

const stats = [
  { label: 'Revenue', value: '$48.2k', change: '+12.4%', up: true, progress: 72 },
  { label: 'New users', value: '1,204', change: '+4.1%', up: true, progress: 48 },
  { label: 'Churn', value: '2.3%', change: '-0.6%', up: false, progress: 23 },
  { label: 'Tickets open', value: '37', change: '+9', up: false, progress: 61 },
];
const orders = [
  { id: '#1042', customer: 'Grace Hopper', status: 'paid', total: 129 },
  { id: '#1041', customer: 'Alan Turing', status: 'pending', total: 59 },
  { id: '#1040', customer: 'Katherine Johnson', status: 'paid', total: 240 },
  { id: '#1039', customer: 'Linus Torvalds', status: 'refunded', total: 18 },
];
const statusAction = { paid: 'success', pending: 'warning', refunded: 'danger' } as const;

function DashboardPattern() {
  const [rows, setRows] = useState(orders);
  return (
    <Stack gap={6}>
      <Grid cols={4} gap={4}>
        {stats.map((s) => (
          <Card key={s.label} padding="md">
            <Stack gap={2}>
              <Inline justify="between" align="start">
                <Text variant="small" muted>
                  {s.label}
                </Text>
                <Badge size="sm" action={s.up ? 'success' : 'danger'}>
                  {s.change}
                </Badge>
              </Inline>
              <Heading as="h3" size="xl">
                {s.value}
              </Heading>
              <Progress value={s.progress} size="sm" label={`${s.label} progress toward goal`} />
            </Stack>
          </Card>
        ))}
      </Grid>
      <Card padding="none">
        <Inline justify="between" style={{ padding: 16 }}>
          <Heading as="h3" size="md">
            Recent orders
          </Heading>
          <Button size="sm" variant="outline" color="neutral" onPress={() => setRows(rows.length ? [] : orders)}>
            {rows.length ? 'Clear' : 'Restore'}
          </Button>
        </Inline>
        {rows.length ? (
          <Table hoverable>
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
                  <TableCell>{o.id}</TableCell>
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
          <EmptyState
            title="No orders yet"
            description="Orders appear here as soon as a customer checks out."
            actions={
              <Button size="sm" onPress={() => setRows(orders)}>
                Load sample orders
              </Button>
            }
          />
        )}
      </Card>
    </Stack>
  );
}

const wizard = [
  { label: 'Account', description: 'Who are you?' },
  { label: 'Plan', description: 'Pick a tier' },
  { label: 'Review', description: 'Check and confirm' },
];
const plans = [
  ['free', 'Free', '1 project'],
  ['pro', 'Pro', 'Unlimited projects, $12/mo'],
  ['team', 'Team', 'Roles and SSO, $39/mo'],
] as const;

function WizardPattern() {
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState<string>('pro');
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const last = wizard.length - 1;
  const valid = /.+@.+\..+/.test(email);
  const canNext = step !== 0 || valid;
  return (
    <Card padding="lg">
      <Stack gap={8}>
        <Stepper steps={wizard} current={step} />
        <View accessibilityLiveRegion="polite">
          {step === 0 && (
            <FormField label="Email" hint="We will send a confirmation link" error={email && !valid ? 'Enter a valid email' : undefined}>
              <Input value={email} onChangeText={setEmail} placeholder="you@company.com" keyboardType="email-address" autoCapitalize="none" />
            </FormField>
          )}
          {step === 1 && (
            <RadioGroup accessibilityLabel="Plan">
              {plans.map(([id, name, desc]) => (
                <Radio key={id} label={`${name}: ${desc}`} checked={plan === id} onCheckedChange={() => setPlan(id)} />
              ))}
            </RadioGroup>
          )}
          {step === 2 && (
            <Stack gap={1}>
              <Text>
                {email} on the {plan} plan.
              </Text>
              <Text variant="small" muted>
                Press confirm to create your account.
              </Text>
            </Stack>
          )}
        </View>
        <CardFooter>
          <Button variant="ghost" color="neutral" disabled={step === 0} onPress={() => setStep((s) => s - 1)}>
            Back
          </Button>
          {step < last ? (
            <Button disabled={!canNext} onPress={() => setStep((s) => s + 1)}>
              Continue
            </Button>
          ) : (
            <Button
              action="success"
              onPress={() => {
                toast({ title: 'Account created', description: email, action: 'success' });
                setStep(0);
                setEmail('');
              }}>
              Confirm
            </Button>
          )}
        </CardFooter>
      </Stack>
    </Card>
  );
}

export default function Patterns() {
  return (
    <Screen title="Patterns">
      <Section title="Layout primitives" hint="Stack, Inline and Grid only arrange children; they never set colors.">
        <LayoutDemo />
      </Section>
      <Section title="Sign-in form" hint="Required fields, hints, a loading button and a toast on success.">
        <LoginPattern />
      </Section>
      <Section title="Settings" hint="Cards group related fields. Save stays disabled until something changes.">
        <SettingsPattern />
      </Section>
      <Section title="Dashboard" hint="Stat cards with badges and progress, a table, and an empty state.">
        <DashboardPattern />
      </Section>
      <Section title="Multi-step wizard" hint="Stepper shows progress; validation gates the Continue button.">
        <WizardPattern />
      </Section>
    </Screen>
  );
}
