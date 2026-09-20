import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signToken, COOKIE_NAME } from "@/lib/auth";

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

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Generate 6-digit verification code and token
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationToken = crypto.randomUUID();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        companyName: companyName?.trim() || null,
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        gstin: gstin?.trim() || null,
        role: "user",
        isEmailVerified: false,
        verificationCode,
        verificationToken,
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

    // NOTE: Signup does NOT auto-login. User must verify email first.
    return NextResponse.json(
      {
        success: true,
        requiresVerification: true,
        message: "Account created successfully. Please verify your email address to continue.",
        email: user.email,
        verificationCode: user.verificationCode,
        verificationToken: user.verificationToken,
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
