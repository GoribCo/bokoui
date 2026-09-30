import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { StaffForm } from "@/components/examples/staff-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Form",
  description: "A validated form inside the shell.",
  path: "/examples/form",
});

export default function FormPage() {
  return (
    <PageContainer>
      <PageHeader title="Form" description="React Hook Form with a Zod schema." />
      <StaffForm />
    </PageContainer>
  );
}
