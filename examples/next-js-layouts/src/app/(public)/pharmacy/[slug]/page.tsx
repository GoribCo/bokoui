import { createPublicProfileRoute } from "@/components/organization/public-profile-route";

const route = createPublicProfileRoute("pharmacy");

export const generateMetadata = route.generateMetadata;
export const generateStaticParams = route.generateStaticParams;
export default route.Page;
