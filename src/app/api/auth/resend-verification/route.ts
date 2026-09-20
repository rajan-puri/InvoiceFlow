import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { sendVerificationOtpEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email address" },
        { status: 404 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        message: "Your email is already verified. You can sign in immediately.",
      });
    }

    // Generate secure 6-digit verification OTP and 15-minute expiry
    const verificationCode = crypto.randomInt(100000, 1000000).toString();
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode,
        verificationToken: null,
        verificationExpires,
      },
    });

    // Send new OTP to user's registered email
    await sendVerificationOtpEmail({
      to: user.email,
      name: user.name,
      otp: verificationCode,
    });

    // OTP is strictly NOT exposed in the response
    return NextResponse.json({
      success: true,
      message: "A new 6-digit verification code has been sent to your email address.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Failed to generate new verification code. Please try again." },
      { status: 500 }
    );
  }
}
