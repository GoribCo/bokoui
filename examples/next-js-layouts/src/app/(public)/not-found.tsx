import { NotFoundView } from "@/components/layout/not-found-view";

/** 404 inside the public layout (e.g. an unknown organization slug); the layout already provides `<main>`. */
export default function PublicNotFound() {
  return (
    <div className="flex min-h-[60dvh] items-center justify-center">
      <NotFoundView />
    </div>
  );
}
