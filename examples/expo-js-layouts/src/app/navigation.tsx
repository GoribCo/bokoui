import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Breadcrumb,
  BreadcrumbItem,
  Navbar,
  NavbarBrand,
  NavbarLink,
  Pagination,
  Sidebar,
  SidebarItem,
  SidebarSection,
  Tab,
  TabList,
  TabPanel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  Text,
  Button,
} from 'bokoui/expo';
import { useState } from 'react';
import { View } from 'react-native';

import { Row, Screen, Section } from '@/components/screen';

const rows = [
  { name: 'Ada', role: 'Engineer', score: 98 },
  { name: 'Grace', role: 'Admiral', score: 95 },
  { name: 'Linus', role: 'Maintainer', score: 91 },
  { name: 'Margaret', role: 'Lead', score: 99 },
];

export default function Navigation() {
  const [page, setPage] = useState(3);
  const [link, setLink] = useState('Home');
  const [collapsed, setCollapsed] = useState(false);
  const [asc, setAsc] = useState(false);
  const sorted = [...rows].sort((a, b) => (asc ? a.score - b.score : b.score - a.score));

  return (
    <Screen title="Navigation">
      <Section title="Navbar">
        <Navbar brand={<NavbarBrand>bokoui</NavbarBrand>} actions={<Button size="sm">Sign in</Button>}>
          {['Home', 'Docs', 'Pricing'].map((l) => (
            <NavbarLink key={l} active={link === l} onPress={() => setLink(l)}>
              {l}
            </NavbarLink>
          ))}
        </Navbar>
      </Section>

      <Section title="Breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem onPress={() => {}}>Home</BreadcrumbItem>
          <BreadcrumbItem onPress={() => {}}>Projects</BreadcrumbItem>
          <BreadcrumbItem current>Settings</BreadcrumbItem>
        </Breadcrumb>
      </Section>

      <Section title="Tabs">
        <Tabs defaultValue="account">
          <TabList>
            <Tab value="account">Account</Tab>
            <Tab value="security">Security</Tab>
            <Tab value="billing" disabled>
              Billing
            </Tab>
          </TabList>
          <TabPanel value="account">
            <Text>Account settings.</Text>
          </TabPanel>
          <TabPanel value="security">
            <Text>Security settings.</Text>
          </TabPanel>
        </Tabs>
        <Tabs defaultValue="a" variant="pills">
          <TabList>
            <Tab value="a">Pill A</Tab>
            <Tab value="b">Pill B</Tab>
          </TabList>
          <TabPanel value="a">
            <Text>Pills variant.</Text>
          </TabPanel>
          <TabPanel value="b">
            <Text>Second pill.</Text>
          </TabPanel>
        </Tabs>
      </Section>

      <Section title="Accordion">
        <Accordion defaultValue="a">
          <AccordionItem value="a">
            <AccordionTrigger>What is bokoui?</AccordionTrigger>
            <AccordionContent>Themeable components for React, Vue and Expo.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>How many styles?</AccordionTrigger>
            <AccordionContent>Eight styles, each with light and dark modes.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section title="Sidebar">
        <Row>
          <Button size="sm" variant="outline" onPress={() => setCollapsed(!collapsed)}>
            {collapsed ? 'Expand' : 'Collapse'}
          </Button>
        </Row>
        <View style={{ height: 260, flexDirection: 'row' }}>
          <Sidebar collapsed={collapsed}>
            <SidebarSection title="Main">
              <SidebarItem active icon={<Text>🏠</Text>}>
                Dashboard
              </SidebarItem>
              <SidebarItem icon={<Text>📁</Text>} description="12 items">
                Projects
              </SidebarItem>
            </SidebarSection>
            <SidebarSection title="Account">
              <SidebarItem icon={<Text>⚙️</Text>}>Settings</SidebarItem>
            </SidebarSection>
          </Sidebar>
        </View>
      </Section>

      <Section title="Table">
        <Table striped>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead numeric sort={asc ? 'ascending' : 'descending'} onSort={() => setAsc(!asc)}>
                Score
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((r) => (
              <TableRow key={r.name}>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.role}</TableCell>
                <TableCell numeric>{r.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Section title="Pagination">
        <Pagination page={page} pageCount={12} onPageChange={setPage} />
      </Section>
    </Screen>
  );
}
