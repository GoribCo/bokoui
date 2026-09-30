"use client";

import { useState } from "react";
import { Card, Text } from "bokoui/react";
import { Tab, TabList, TabPanel, Tabs } from "bokoui/react/client";

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

function List({ label }: { label: string }) {
  return (
    <TabList aria-label={label}>
      <Tab value="overview">Overview</Tab>
      <Tab value="activity">Activity</Tab>
      <Tab value="settings">Settings</Tab>
      <Tab value="billing" disabled>
        Billing
      </Tab>
    </TabList>
  );
}

export function TabsDemo() {
  const [value, setValue] = useState("activity");
  return (
    <div className="flex flex-col gap-8">
      <Tabs defaultValue="overview">
        <List label="Underline tabs" />
        <Panels />
      </Tabs>

      <Tabs defaultValue="overview" variant="pills" color="accent">
        <List label="Pill tabs" />
        <Panels />
      </Tabs>

      <Tabs defaultValue="overview" orientation="vertical" action="success">
        <List label="Vertical tabs" />
        <div className="flex-1">
          <Panels />
        </div>
      </Tabs>

      <Card>
        <Tabs value={value} onValueChange={setValue} variant="pills">
          <List label="Controlled tabs" />
          <Panels />
        </Tabs>
        <Text variant="small" muted>
          Controlled from outside: current tab is <strong>{value}</strong>.
        </Text>
      </Card>
    </div>
  );
}
