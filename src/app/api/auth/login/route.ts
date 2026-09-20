import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Support both new InvoBazar and existing demo/admin credentials
    if (!user && (normalizedEmail === "demo@invobazar.in" || normalizedEmail === "admin@invobazar.in")) {
      user = await prisma.user.findUnique({
        where: { email: "demo@invoiceflow.io" },
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if email has been verified
    if (!user.isEmailVerified) {
      return NextResponse.json(
        {
          error: "Please verify your email address before signing in.",
          requiresVerification: true,
          email: user.email,
        },
        { status: 403 }
      );
    }

    // Update lastActiveAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    const userRole = (user.role as "user" | "admin") || "user";

    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: userRole,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: userRole,
        companyName: user.companyName,
      },
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Failed to log in. Please try again." },
      { status: 500 }
    );
  }
}
