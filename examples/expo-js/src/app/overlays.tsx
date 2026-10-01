import { Button, Drawer, Menu, MenuItem, MenuLabel, MenuSeparator, Modal, Popover, Text, Tooltip } from 'bokoui/expo';
import { useState } from 'react';

import { Row, Screen, Section } from '@/components/screen';

export default function Overlays() {
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState<'left' | 'right' | 'bottom' | null>(null);
  const [last, setLast] = useState('none');

  return (
    <Screen title="Overlays">
      <Section title="Modal and Drawer">
        <Row>
          <Button onPress={() => setModal(true)}>Open modal</Button>
          {(['left', 'right', 'bottom'] as const).map((side) => (
            <Button key={side} variant="outline" onPress={() => setDrawer(side)}>
              Drawer {side}
            </Button>
          ))}
        </Row>
        <Modal
          open={modal}
          onOpenChange={setModal}
          title="Delete project?"
          description="This cannot be undone."
          footer={
            <>
              <Button variant="ghost" color="neutral" onPress={() => setModal(false)}>
                Cancel
              </Button>
              <Button action="danger" onPress={() => setModal(false)}>
                Delete
              </Button>
            </>
          }>
          <Text>All files in the project will be removed.</Text>
        </Modal>
        <Drawer open={drawer !== null} onOpenChange={() => setDrawer(null)} side={drawer ?? 'right'} title="Filters">
          <Text>Drawer content slides in from the {drawer} edge.</Text>
        </Drawer>
      </Section>

      <Section title="Menu" hint={`Last action: ${last}`}>
        <Menu trigger={<Button variant="outline">Actions</Button>} label="Actions">
          <MenuLabel>Project</MenuLabel>
          <MenuItem onSelect={() => setLast('Rename')}>Rename</MenuItem>
          <MenuItem onSelect={() => setLast('Duplicate')}>Duplicate</MenuItem>
          <MenuItem disabled>Archive (disabled)</MenuItem>
          <MenuSeparator />
          <MenuItem danger onSelect={() => setLast('Delete')}>
            Delete
          </MenuItem>
        </Menu>
      </Section>

      <Section title="Popover">
        <Popover trigger={<Button variant="soft">Details</Button>} label="Details">
          <Text variant="small">A popover can hold any content, like text, a form or links.</Text>
        </Popover>
      </Section>

      <Section title="Tooltip" hint="Long press the button.">
        <Tooltip content="Saves the document">
          <Button variant="outline">Save</Button>
        </Tooltip>
      </Section>
    </Screen>
  );
}
