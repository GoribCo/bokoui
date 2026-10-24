import { ConsultationSample } from "@/components/examples/consultation/consultation-sample";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sample: patient consultation",
  description: "Visual mockup of the doctor-facing consultation page: patient/doctor summary, history, vitals, diagnosis, tests, prescriptions and follow-up.",
  path: "/consultations/sample",
});

export default function Page() {
  return <ConsultationSample />;
}
