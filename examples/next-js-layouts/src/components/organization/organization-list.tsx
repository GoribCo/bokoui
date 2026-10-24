"use client";

import { Badge, Card, CardHeader, Grid, Heading, Inline, Skeleton, Text } from "bokoui/react";
import { QueryError } from "@/components/layout/query-error";
import { useOrganizations } from "@/hooks/use-organizations";

/** The signed-in user's organizations with their roles, read through `useOrganizations`. */
export function OrganizationList() {
  const organizations = useOrganizations();

  if (organizations.isPending) {
    return (
      <Grid aria-busy="true">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-28 w-full" />
        ))}
      </Grid>
    );
  }
  if (organizations.isError) return <QueryError error={organizations.error} onRetry={() => void organizations.refetch()} />;

  return (
    <Grid>
      {organizations.data.map((organization) => (
        <Card key={organization.id}>
          <CardHeader>
            <Heading as="h2" size="md">
              {organization.name}
            </Heading>
            <Text muted className="capitalize">
              {organization.type}
            </Text>
          </CardHeader>
          <Inline gap={2} className="mt-3">
            {organization.roles.map((role) => (
              <Badge key={role} color="neutral" className="capitalize">
                {role}
              </Badge>
            ))}
          </Inline>
        </Card>
      ))}
    </Grid>
  );
}
