import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Used by the root layout to decide whether to render the consumer
// AppShell (sidebar/topbar) or leave admin pages with their own minimal
// chrome (spec section 12: "admin keeps its own simpler shell").
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-vv-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
