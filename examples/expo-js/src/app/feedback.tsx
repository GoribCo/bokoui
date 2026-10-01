import { Alert, Button, Spinner, useToast } from 'bokoui/expo';
import { useState } from 'react';

import { Row, Screen, Section } from '@/components/screen';

export default function Feedback() {
  const { toast, dismiss } = useToast();
  const [shown, setShown] = useState(true);

  return (
    <Screen title="Feedback">
      <Section title="Alert">
        <Alert title="neutral">A neutral message with a description.</Alert>
        {(['info', 'success', 'warning', 'danger'] as const).map((action) => (
          <Alert key={action} action={action} title={action}>
            A {action} message with a description.
          </Alert>
        ))}
        {shown ? (
          <Alert variant="outline" action="info" title="Dismissible" onClose={() => setShown(false)}>
            Press the × to close.
          </Alert>
        ) : (
          <Button size="sm" variant="outline" onPress={() => setShown(true)}>
            Show alert again
          </Button>
        )}
        <Alert variant="solid" action="danger" title="Solid">
          High emphasis.
        </Alert>
      </Section>

      <Section title="Toast">
        <Row>
          <Button onPress={() => toast({ title: 'Saved', description: 'Your changes were saved.', action: 'success' })}>Success</Button>
          <Button variant="outline" color="neutral" onPress={() => toast({ title: 'Heads up', description: 'This stays until closed.', action: 'warning', duration: 0 })}>
            Sticky
          </Button>
          <Button variant="ghost" color="neutral" onPress={() => dismiss()}>
            Dismiss all
          </Button>
        </Row>
      </Section>

      <Section title="Spinner">
        <Row>
          <Spinner size="sm" />
          <Spinner />
          <Spinner color="accent" />
        </Row>
      </Section>
    </Screen>
  );
}
