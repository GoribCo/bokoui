"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Inline } from "@/components/layout/primitives";
import { useActiveOrganization } from "@/hooks/use-active-organization";

/** Shows the organization context hook in action: name and effective roles follow the switcher. */
export function ActiveOrganizationCard() {
  const { organization, roles } = useActiveOrganization();
  return (
    <Card>
      <CardHeader>
        <CardDescription className="capitalize">{organization.type}</CardDescription>
        <CardTitle>{organization.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Inline gap={2}>
          {roles.map((role) => (
            <Badge key={role} variant="secondary" className="capitalize">
              {role}
            </Badge>
          ))}
        </Inline>
      </CardContent>
    </Card>
  );
}
