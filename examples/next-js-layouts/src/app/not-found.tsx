import { NotFoundView } from "@/components/layout/not-found-view";

/** Unknown URLs and `notFound()` outside the signed-in area (e.g. an unknown organization slug). */
export default function NotFound() {
  return (
    <main id="main-content" className="flex min-h-dvh items-center justify-center text-foreground">
      <NotFoundView />
    </main>
  );
}
