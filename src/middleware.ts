import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.includes("/owner") || pathname.startsWith("/api/owner")) {
    const token = req.cookies.get("owner_session")?.value;
    const isOwnerLogin = pathname.startsWith("/api/owner/auth/");
    if (!token && pathname.startsWith("/api/owner") && !isOwnerLogin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/owner/:path*", "/:cafeId/owner/:path*"]
};
