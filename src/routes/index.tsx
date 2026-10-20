import { createFileRoute } from "@tanstack/react-router";
import { FareApp } from "@/components/fare-app";
import { parseFareSearch } from "@/lib/fare-search";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => parseFareSearch(search),
  component: FareApp,
});
