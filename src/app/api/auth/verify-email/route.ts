import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, code, token } = body;

    if (!email && !token) {
      return NextResponse.json(
        { error: "Email or verification token is required" },
        { status: 400 }
      );
    }

    let user;

    if (token) {
      user = await prisma.user.findFirst({
        where: { verificationToken: token },
      });
    } else if (email && code) {
      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (user && user.verificationCode !== code.trim()) {
        return NextResponse.json(
          { error: "Invalid verification code. Please check and try again." },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Please provide the 6-digit verification code" },
        { status: 400 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "Account not found or invalid verification request" },
        { status: 404 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        message: "Email is already verified. You can log in now.",
      });
    }

    if (user.verificationExpires && new Date(user.verificationExpires) < new Date()) {
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new code." },
        { status: 410 }
      );
    }

    // Mark as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        verificationCode: null,
        verificationToken: null,
        verificationExpires: null,
        lastActiveAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email successfully verified! You can now log in.",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify email. Please try again." },
      { status: 500 }
    );
  }
}
