import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "invoiceflow-super-secret-key-change-in-production-min32chars"
);

const COOKIE_NAME = "invoiceflow_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  let isAuthenticated = false;
  let userRole: string | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET);
      isAuthenticated = true;
      userRole = (payload as { role?: string }).role || "user";
    } catch {
      isAuthenticated = false;
      userRole = null;
    }
  }

  const isAdminPage = pathname.startsWith("/admin");
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isProtectedPage =
    isAdminPage ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/clients") ||
    pathname.startsWith("/invoices") ||
    pathname.startsWith("/templates") ||
    pathname.startsWith("/settings");

  // If trying to access any protected page while not logged in
  if (isProtectedPage && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If trying to access /admin but not an admin
  if (isAdminPage && userRole !== "admin") {
    const dashboardUrl = new URL("/dashboard", request.url);
    dashboardUrl.searchParams.set("error", "unauthorized_admin");
    return NextResponse.redirect(dashboardUrl);
  }

  // If already logged in and visiting login/register
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/products/:path*",
    "/clients/:path*",
    "/invoices/:path*",
    "/templates/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};
