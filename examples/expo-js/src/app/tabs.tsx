import { Card, Tab, TabList, TabPanel, Tabs, Text } from 'bokoui/expo';
import { useState } from 'react';
import { View } from 'react-native';

import { Screen, Section } from '@/components/screen';

function Panels() {
  return (
    <>
      <TabPanel value="overview">
        <Text>Overview: a summary of the project.</Text>
      </TabPanel>
      <TabPanel value="activity">
        <Text>Activity: what changed recently.</Text>
      </TabPanel>
      <TabPanel value="settings">
        <Text>Settings: configuration options.</Text>
      </TabPanel>
    </>
  );
}

function List() {
  return (
    <TabList>
      <Tab value="overview">Overview</Tab>
      <Tab value="activity">Activity</Tab>
      <Tab value="settings">Settings</Tab>
      <Tab value="billing" disabled>
        Billing
      </Tab>
    </TabList>
  );
}

export default function TabsScreen() {
  const [value, setValue] = useState('activity');
  return (
    <Screen title="Tabs">
      <Section title="Underline" hint="The disabled tab cannot be selected.">
        <Tabs defaultValue="overview">
          <List />
          <Panels />
        </Tabs>
      </Section>

      <Section title="Pills">
        <Tabs defaultValue="overview" variant="pills" color="accent">
          <List />
          <Panels />
        </Tabs>
      </Section>

      <Section title="Vertical">
        <Tabs defaultValue="overview" orientation="vertical" action="success">
          <List />
          <View style={{ flex: 1 }}>
            <Panels />
          </View>
        </Tabs>
      </Section>

      <Section title="Controlled">
        <Card>
          <Tabs value={value} onValueChange={setValue} variant="pills">
            <List />
            <Panels />
          </Tabs>
          <Text variant="small" muted>
            Controlled from outside: current tab is {value}.
          </Text>
        </Card>
      </Section>
    </Screen>
  );
}
