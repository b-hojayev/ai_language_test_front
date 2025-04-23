import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/",
  "/admin",
  "/admin/books",
  "/admin/faculties",
  "/admin/groups",
  "/admin/results",
  "/admin/specialities",
  "/admin/students",
  "/admin/tests",
  "/student",
  "/student/book",
  "/student/test",
];
const publicRoutes = ["/login"];

export const middleware = async (req: NextRequest) => {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const token = (await cookies()).get("token")?.value;
  const role = (await cookies()).get("role")?.value;

  console.log("middleware token:", token);
  console.log("middleware role:", role);

  if ((!token || !role) && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (token && role !== "admin" && role !== "student") {
    (await cookies()).delete("token");
    (await cookies()).delete("role");
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (token && role === "admin" && !path.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin/faculties", req.nextUrl));
  }

  if (token && role === "admin" && path === "/admin") {
    return NextResponse.redirect(new URL("/admin/faculties", req.nextUrl));
  }

  if (token && role === "student" && !path.startsWith("/student")) {
    return NextResponse.redirect(new URL("/student", req.nextUrl));
  }
};

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
