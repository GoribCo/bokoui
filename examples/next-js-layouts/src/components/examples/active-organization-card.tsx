"use client";

import { Badge, Card, CardHeader, Heading, Inline, Text } from "bokoui/react";
import { useActiveOrganization } from "@/hooks/use-active-organization";

/** Shows the organization context hook in action: name and effective roles follow the switcher. */
export function ActiveOrganizationCard() {
  const { organization, roles } = useActiveOrganization();
  return (
    <Card>
      <CardHeader>
        <Heading as="h2" size="md">
          {organization.name}
        </Heading>
        <Text muted className="capitalize">
          {organization.type}
        </Text>
      </CardHeader>
      <Inline gap={2} className="mt-3">
        {roles.map((role) => (
          <Badge key={role} className="capitalize">
            {role}
          </Badge>
        ))}
      </Inline>
    </Card>
  );
}
