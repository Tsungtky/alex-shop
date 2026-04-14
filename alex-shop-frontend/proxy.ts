import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const role = request.cookies.get("role")?.value;

    if (role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
