import { createPublicProfileRoute } from "@/components/organization/public-profile-route";

const route = createPublicProfileRoute("company");

export const generateMetadata = route.generateMetadata;
export default route.Page;
