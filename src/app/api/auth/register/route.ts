import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { sendVerificationOtpEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, companyName, phone, address, gstin } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Generate secure 6-digit verification OTP and 15-minute expiry
    const verificationCode = crypto.randomInt(100000, 1000000).toString();
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        companyName: companyName?.trim() || null,
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        gstin: gstin?.trim() || null,
        role: "user",
        isEmailVerified: false,
        verificationCode,
        verificationToken: null,
        verificationExpires,
      },
    });

    // Seed sample initial product and client for a smooth onboarding experience
    await prisma.product.createMany({
      data: [
        {
          userId: user.id,
          name: "Enterprise Software License",
          sku: "SFT-001",
          description: "Annual recurring license with premium 24/7 SLA support",
          price: 49999,
          gstRate: 18,
          unit: "NOS",
          category: "Software",
        },
        {
          userId: user.id,
          name: "Cloud Architecture Consulting",
          sku: "SRV-002",
          description: "Technical consulting and cloud infrastructure migration",
          price: 15000,
          gstRate: 18,
          unit: "HRS",
          category: "Services",
        },
      ],
    });

    await prisma.client.create({
      data: {
        userId: user.id,
        companyName: "Acme Global Technologies Ltd.",
        contactPerson: "Sarah Jenkins",
        email: "sarah@acmeglobal.com",
        phone: "+91 98765 43210",
        billingAddress: "402 Tech Park, Sector 62, Bangalore, Karnataka - 560100",
        shippingAddress: "402 Tech Park, Sector 62, Bangalore, Karnataka - 560100",
        gstin: "29AAAAA0000A1Z5",
      },
    });

    // Send OTP to the user's registered email via Resend
    await sendVerificationOtpEmail({
      to: user.email,
      name: user.name,
      otp: verificationCode,
    });

    // Strictly return only safe public information. OTP is NEVER exposed in the API response.
    return NextResponse.json(
      {
        success: true,
        requiresVerification: true,
        message: "Account created successfully. A 6-digit verification code has been sent to your email.",
        email: user.email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
