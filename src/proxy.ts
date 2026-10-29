import { NextResponse, type NextRequest } from "next/server";
import {
  fareQueryString,
  fareSearchParams,
  parseFareSearch,
  partyFromSearch,
} from "@/lib/fare-search";

export function proxy(request: NextRequest) {
  const search = parseFareSearch(Object.fromEntries(request.nextUrl.searchParams));
  const normalized = fareSearchParams({
    from: search.from ?? null,
    to: search.to ?? null,
    party: partyFromSearch(search),
  });
  const url = request.nextUrl.clone();
  url.search = fareQueryString(normalized);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    { source: "/", has: [{ type: "query", key: "passengers" }] },
    { source: "/", has: [{ type: "query", key: "concession" }] },
  ],
};
