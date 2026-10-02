import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardFooter,
  CardHeader,
  Checkbox,
  Divider,
  EmptyState,
  FormField,
  Heading,
  Image,
  Input,
  Link,
  Pagination,
  Progress,
  Radio,
  RadioGroup,
  Sidebar,
  SidebarItem,
  SidebarSection,
  Skeleton,
  SkeletonText,
  Slider,
  Spinner,
  Stepper,
  Switch,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
  Text,
  Textarea,
} from "@/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Calendar,
  Combobox,
  CommandPalette,
  DatePicker,
  Drawer,
  FileUpload,
  Menu,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  Modal,
  Navbar,
  NavbarBrand,
  NavbarLink,
  Popover,
  Rating,
  Select,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  ToastProvider,
  Tooltip,
  useToast,
} from "@/react";
import { expectNoA11yViolations } from "@test/helpers/axe";

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
];

describe("axe helper", () => {
  it("actually fails on real violations (so a pass means something)", async () => {
    const { container } = render(
      <main>
        <img src="/x.png" />
        <button />
        <input />
      </main>,
    );
    await expect(expectNoA11yViolations(container)).rejects.toThrow(/image-alt|button-name|label/);
  });
});

describe("axe: static components", () => {
  it("Button, Link, Heading and Text", async () => {
    const { container } = render(
      <main>
        <Heading as="h1">Title</Heading>
        <Text>Body <Link href="/x">link</Link> <Link href="https://x.dev" external>external</Link></Text>
        <Button>Go</Button>
        <Button loading>Saving</Button>
        <Button disabled>Off</Button>
        <Button iconOnly aria-label="Search">
          <svg aria-hidden="true" />
        </Button>
      </main>,
    );
    await expectNoA11yViolations(container);
  });

  it("form controls inside FormField, with hints and errors", async () => {
    const { container } = render(
      <form>
        <FormField label="Email" hint="We never share it"><Input type="email" /></FormField>
        <FormField label="Name" required error="Required"><Input /></FormField>
        <FormField label="Bio" hint="Short"><Textarea /></FormField>
        <FormField label="Volume"><Slider /></FormField>
        <FormField label="Fruit" error="Pick one"><Select options={fruits} /></FormField>
        <FormField label="Country" hint="Type to filter"><Combobox options={fruits} /></FormField>
        <FormField label="Date" error="Required"><DatePicker locale="en-US" /></FormField>
        <Checkbox label="Accept" />
        <Checkbox label="Bad" invalid />
        <Switch label="Wi-Fi" />
        <RadioGroup aria-label="Plan"><Radio name="p" value="a" label="A" defaultChecked /><Radio name="p" value="b" label="B" /></RadioGroup>
        <Rating aria-label="Quality" defaultValue={3} />
        <Rating readOnly aria-label="Average" value={4} />
        <FileUpload label="Upload a file" />
      </form>,
    );
    await expectNoA11yViolations(container);
  });

  it("display components", async () => {
    const { container } = render(
      <main>
        <Badge>New</Badge>
        <Avatar name="Ada Lovelace" />
        <Avatar name="Ada" src="/a.png" />
        <Tag onRemove={() => {}}>tag</Tag>
        <Tag onClick={() => {}} pressed>filter</Tag>
        <Divider />
        <Divider label="or" />
        <Card><CardHeader><Heading as="h2">Card</Heading></CardHeader><Text>Body</Text><CardFooter><Button>OK</Button></CardFooter></Card>
        <Image src="/a.png" alt="A cat" />
        <EmptyState title="Nothing" description="Add something" actions={<Button>Add</Button>} />
        <Stepper aria-label="Steps" steps={[{ label: "One" }, { label: "Two" }, { label: "Three" }]} current={1} />
      </main>,
    );
    await expectNoA11yViolations(container);
  });

  it("feedback components", async () => {
    const { container } = render(
      <main>
        <Alert action="danger" title="Oops">Broken</Alert>
        <Alert action="success" onClose={() => {}}>Saved</Alert>
        <Spinner />
        <Progress value={40} label="Upload" showValue />
        <Progress aria-label="Loading" />
        <div aria-busy="true"><Skeleton /><SkeletonText lines={2} /></div>
      </main>,
    );
    await expectNoA11yViolations(container);
  });

  it("navigation and data components", async () => {
    const { container } = render(
      <div>
        <Navbar brand={<NavbarBrand href="/">Brand</NavbarBrand>} actions={<Button>Sign in</Button>}>
          <NavbarLink href="/" active>Home</NavbarLink>
          <NavbarLink href="/docs">Docs</NavbarLink>
        </Navbar>
        <Sidebar aria-label="App">
          <SidebarSection title="Main"><SidebarItem href="/" active>Home</SidebarItem><SidebarItem href="/x" disabled>Locked</SidebarItem></SidebarSection>
        </Sidebar>
        <main>
          <Breadcrumb><BreadcrumbItem href="/">Home</BreadcrumbItem><BreadcrumbItem current>Page</BreadcrumbItem></Breadcrumb>
          <Pagination page={3} pageCount={10} onPageChange={() => {}} />
          <Table aria-label="People">
            <TableCaption>People</TableCaption>
            <TableHeader><TableRow><TableHead sort="ascending" onSort={() => {}}>Name</TableHead><TableHead numeric>Age</TableHead></TableRow></TableHeader>
            <TableBody><TableRow><TableCell>Ada</TableCell><TableCell numeric>36</TableCell></TableRow></TableBody>
          </Table>
        </main>
      </div>,
    );
    await expectNoA11yViolations(container);
  });

  it("Tabs and Accordion", async () => {
    const { container } = render(
      <main>
        <Tabs defaultValue="a">
          <TabList aria-label="Sections"><Tab value="a">A</Tab><Tab value="b">B</Tab><Tab value="c" disabled>C</Tab></TabList>
          <TabPanel value="a">Panel A</TabPanel>
          <TabPanel value="b">Panel B</TabPanel>
        </Tabs>
        <Accordion defaultValue="a">
          <AccordionItem value="a"><AccordionTrigger>One</AccordionTrigger><AccordionContent>Answer</AccordionContent></AccordionItem>
          <AccordionItem value="b"><AccordionTrigger>Two</AccordionTrigger><AccordionContent>Answer</AccordionContent></AccordionItem>
        </Accordion>
        <Accordion regions defaultValue="a">
          <AccordionItem value="a"><AccordionTrigger>Three</AccordionTrigger><AccordionContent>Answer</AccordionContent></AccordionItem>
        </Accordion>
      </main>,
    );
    await expectNoA11yViolations(container);
  });

  it("Calendar", async () => {
    const { container } = render(<main><Calendar value={new Date(2026, 8, 15)} locale="en-US" /></main>);
    await expectNoA11yViolations(container);
  });
});

describe("axe: open overlays", () => {
  it("Modal, Drawer and CommandPalette", async () => {
    const { container, unmount } = render(
      <main>
        <Modal open onOpenChange={() => {}} title="Edit" description="Change things" footer={<Button>Save</Button>}>Body</Modal>
      </main>,
    );
    await expectNoA11yViolations(container);
    unmount();
    const drawer = render(<Drawer open onOpenChange={() => {}} title="Filters">Body</Drawer>);
    await expectNoA11yViolations(drawer.container);
    drawer.unmount();
    const palette = render(
      <CommandPalette open onOpenChange={() => {}} groups={[{ heading: "Pages", commands: [{ id: "a", label: "Home", onSelect: () => {} }, { id: "b", label: "Docs", disabled: true, onSelect: () => {} }] }]} />,
    );
    await expectNoA11yViolations(palette.container);
  });

  it("Menu, Select and Combobox with their lists open", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <main>
        <Menu trigger={<Button>Options</Button>}>
          <MenuLabel>Actions</MenuLabel>
          <MenuItem>Edit</MenuItem>
          <MenuSeparator />
          <MenuItem danger>Delete</MenuItem>
        </Menu>
        <label>Fruit<Select options={fruits} /></label>
        <label>Search<Combobox options={fruits} /></label>
      </main>,
    );
    await user.click(container.querySelector("button")!);
    await expectNoA11yViolations(container);
    await user.keyboard("{Escape}");
    await user.click(container.querySelector('button[role="combobox"]')!);
    await expectNoA11yViolations(container);
    await user.keyboard("{Escape}");
    await user.click(container.querySelector('input[role="combobox"]')!);
    await expectNoA11yViolations(container);
  });

  it("Popover, DatePicker and Tooltip open", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <main>
        <Popover trigger={<Button>Info</Button>} aria-label="Details"><p>Text</p><button>Inside</button></Popover>
        <label>Date<DatePicker locale="en-US" defaultValue={new Date(2026, 8, 15)} /></label>
        <Tooltip content="Save"><Button>Save</Button></Tooltip>
      </main>,
    );
    const buttons = container.querySelectorAll("button");
    await user.click(buttons[0]);
    await expectNoA11yViolations(container);
    await user.keyboard("{Escape}");
    await user.click(container.querySelector('button[aria-haspopup="dialog"]:not([aria-label])')!.parentElement!.querySelectorAll("button")[0] ?? buttons[1]);
    await user.tab({ shift: true });
    await user.click(buttons[buttons.length - 1]);
    await expectNoA11yViolations(container);
  });

  it("Toasts", async () => {
    function Demo() {
      const { toast } = useToast();
      return <button onClick={() => { toast({ title: "Saved", description: "ok", action: "success", duration: 0 }); toast({ title: "Failed", action: "danger", duration: 0 }); }}>Show</button>;
    }
    const user = userEvent.setup();
    const { container } = render(<ToastProvider><main><Demo /></main></ToastProvider>);
    await user.click(container.querySelector("button")!);
    expect(document.querySelectorAll('[role="alert"], [role="status"]').length).toBeGreaterThan(1);
    await expectNoA11yViolations(document.body);
  });
});
