import { Avatar, Badge, Card, CardFooter, CardHeader, Divider, EmptyState, Grid, Heading, Inline, Progress, Skeleton, SkeletonText, Stack, Stepper, Tag, Text, Button } from 'bokoui/expo';
import { useState } from 'react';
import { View } from 'react-native';

import { Row, Screen, Section } from '@/components/screen';

const steps = [
  { label: 'Account', description: 'Create a login' },
  { label: 'Profile', description: 'Tell us about you' },
  { label: 'Done' },
];

export default function Display() {
  const [tags, setTags] = useState(['design', 'tokens', 'native']);
  const [chip, setChip] = useState(false);
  const [step, setStep] = useState(1);

  return (
    <Screen title="Display">
      <Section title="Badge and Tag">
        <Row>
          {(['solid', 'soft', 'outline'] as const).map((v) => (
            <Badge key={v} variant={v}>
              {v}
            </Badge>
          ))}
        </Row>
        <Row>
          {tags.map((t) => (
            <Tag key={t} onRemove={() => setTags(tags.filter((x) => x !== t))}>
              {t}
            </Tag>
          ))}
          <Tag variant="outline" color="accent" pressed={chip} onPress={() => setChip(!chip)}>
            Filter chip
          </Tag>
        </Row>
      </Section>

      <Section title="Avatar and Divider">
        <Row>
          <Avatar name="Ada Lovelace" />
          <Avatar name="Grace Hopper" color="accent" status />
          <Avatar name="Linus T" shape="square" size="lg" />
        </Row>
        <Divider />
        <Divider label="or" />
      </Section>

      <Section title="Card">
        <Card>
          <CardHeader>
            <Heading as="h3" size="md">
              Card title
            </Heading>
            <Text variant="small" muted>
              Supporting text
            </Text>
          </CardHeader>
          <Text>Body content goes here.</Text>
          <CardFooter>
            <Button size="sm">Open</Button>
            <Button size="sm" variant="ghost" color="neutral">
              Dismiss
            </Button>
          </CardFooter>
        </Card>
      </Section>

      <Section title="Progress and Skeleton">
        <Progress label="Uploading" value={64} showValue />
        <Progress label="Indeterminate" />
        <Progress value={30} size="sm" action="success" />
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Skeleton shape="circle" />
          <View style={{ flex: 1 }}>
            <SkeletonText lines={2} />
          </View>
        </View>
      </Section>

      <Section title="Stepper">
        <Stepper steps={steps} current={step} />
        <Stepper steps={steps} current={step} orientation="vertical" />
        <Row>
          <Button size="sm" variant="outline" disabled={step === 0} onPress={() => setStep(step - 1)}>
            Back
          </Button>
          <Button size="sm" disabled={step === steps.length} onPress={() => setStep(step + 1)}>
            Next
          </Button>
        </Row>
      </Section>

      <Section title="Layout primitives">
        <Stack gap={2}>
          <Badge>Stack</Badge>
          <Badge>children</Badge>
        </Stack>
        <Inline gap={2}>
          <Badge variant="outline">Inline</Badge>
          <Badge variant="outline">wraps</Badge>
        </Inline>
        <Grid cols={3} gap={3}>
          {['1', '2', '3', '4', '5', '6'].map((n) => (
            <Card key={n} padding="sm">
              <Text>Cell {n}</Text>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section title="EmptyState">
        <EmptyState
          title="No projects yet"
          description="Create your first project to get started."
          actions={<Button size="sm">Create project</Button>}
        />
      </Section>
    </Screen>
  );
}
