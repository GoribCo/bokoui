import {
  Checkbox,
  Combobox,
  DatePicker,
  FormField,
  Input,
  Radio,
  RadioGroup,
  Rating,
  Select,
  Slider,
  Switch,
  Textarea,
  Button,
} from 'bokoui/expo';
import { useState } from 'react';

import { Row, Screen, Section } from '@/components/screen';

const fruit = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape', disabled: true },
  { value: 'mango', label: 'Mango' },
];

export default function Forms() {
  const [agree, setAgree] = useState(false);
  const [notify, setNotify] = useState(true);
  const [plan, setPlan] = useState('team');
  const [volume, setVolume] = useState(40);
  const [rating, setRating] = useState(3);
  const [date, setDate] = useState<Date | null>(null);

  return (
    <Screen title="Forms">
      <Section title="FormField">
        <FormField label="Email" hint="We never share it." required>
          <Input placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" />
        </FormField>
        <FormField label="Password" error="Use at least 8 characters.">
          <Input secureTextEntry defaultValue="abc" />
        </FormField>
        <FormField label="Message">
          <Textarea rows={4} placeholder="Say something" />
        </FormField>
        <FormField label="Disabled" disabled>
          <Input defaultValue="Read only" />
        </FormField>
      </Section>

      <Section title="Select, Combobox, DatePicker">
        <Select options={fruit} placeholder="Pick a fruit" accessibilityLabel="Fruit" />
        <Select options={fruit} defaultValue="banana" invalid accessibilityLabel="Fruit (invalid)" />
        <Combobox options={fruit} placeholder="Type to filter" accessibilityLabel="Fruit search" />
        <DatePicker value={date} onValueChange={setDate} accessibilityLabel="Due date" min={new Date()} />
      </Section>

      <Section title="Checkbox, Radio, Switch">
        <Checkbox label="I agree to the terms" checked={agree} onCheckedChange={setAgree} />
        <Checkbox label="Invalid" checked={false} invalid />
        <Switch label="Notifications" checked={notify} onCheckedChange={setNotify} />
        <RadioGroup accessibilityLabel="Plan">
          {['free', 'team', 'enterprise'].map((p) => (
            <Radio key={p} label={p} checked={plan === p} onCheckedChange={() => setPlan(p)} />
          ))}
        </RadioGroup>
      </Section>

      <Section title="Slider and Rating">
        <Slider label="Volume" showValue value={volume} onValueChange={setVolume} />
        <Slider label="Step 10" showValue defaultValue={50} step={10} color="accent" />
        <Slider label="Disabled" defaultValue={30} disabled />
        <Rating label="Rate this demo" value={rating} onValueChange={setRating} />
        <Rating label="Average" value={4} readOnly size="lg" />
      </Section>

      <Row>
        <Button>Submit</Button>
        <Button variant="ghost" color="neutral">
          Cancel
        </Button>
      </Row>
    </Screen>
  );
}
