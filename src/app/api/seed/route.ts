import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.userId;

  try {
    // 1. Add demo products if none exist
    const p1 = await prisma.product.create({
      data: {
        userId,
        name: "Enterprise UI/UX Design System",
        sku: "DS-001",
        description: "Full design token architecture, Figma components & Tailwind library",
        price: 45000,
        gstRate: 18,
        unit: "SET",
        category: "Design",
      },
    });

    const p2 = await prisma.product.create({
      data: {
        userId,
        name: "Fullstack SaaS Development Sprint",
        sku: "DEV-002",
        description: "2-week rapid MVP engineering sprint with Next.js & PostgreSQL",
        price: 95000,
        gstRate: 18,
        unit: "NOS",
        category: "Development",
      },
    });

    const p3 = await prisma.product.create({
      data: {
        userId,
        name: "Annual Cloud Hosting & Maintenance",
        sku: "CLD-003",
        description: "Automated backups, uptime monitoring, and security patching",
        price: 24000,
        gstRate: 18,
        unit: "YR",
        category: "Cloud",
      },
    });

    // 2. Add demo clients
    const c1 = await prisma.client.create({
      data: {
        userId,
        companyName: "Nexus Digital Innovations Pvt Ltd",
        contactPerson: "Rajesh Sharma",
        email: "rajesh@nexusinnovations.in",
        phone: "+91 98111 22334",
        billingAddress: "Tower B, 12th Floor, DLF Cyber City, Gurugram, Haryana - 122002",
        shippingAddress: "Tower B, 12th Floor, DLF Cyber City, Gurugram, Haryana - 122002",
        gstin: "06AABCN1234F1Z8",
      },
    });

    const c2 = await prisma.client.create({
      data: {
        userId,
        companyName: "Zenith Retail Solutions",
        contactPerson: "Priya Nair",
        email: "priya@zenithretail.com",
        phone: "+91 98450 11223",
        billingAddress: "88 Commercial Street, Shivaji Nagar, Bengaluru, Karnataka - 560001",
        shippingAddress: "Warehouse 4, Peenya Industrial Area, Bengaluru - 560058",
        gstin: "29AABCZ9876K1ZA",
      },
    });

    // 3. Add demo invoices
    const subtotal1 = 45000 + 95000;
    const gst1 = (subtotal1 * 18) / 100;
    const grandTotal1 = subtotal1 + gst1;

    await prisma.invoice.create({
      data: {
        userId,
        invoiceNumber: "PI-2026-001",
        issueDate: new Date(),
        validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        status: "SENT",
        clientId: c1.id,
        clientCompanyName: c1.companyName,
        clientContactPerson: c1.contactPerson,
        clientEmail: c1.email,
        clientPhone: c1.phone,
        clientBillingAddress: c1.billingAddress,
        clientShippingAddress: c1.shippingAddress,
        clientGstin: c1.gstin,
        subtotal: subtotal1,
        discountType: "PERCENTAGE",
        discountValue: 0,
        discountAmount: 0,
        gstAmount: gst1,
        grandTotal: grandTotal1,
        notes: "Proforma Invoice valid for 15 days from issue date. 50% advance upon PO approval.",
        terms: "1. Delivery timeline begins after receipt of advance.\n2. Goods/services once supplied are not refundable.",
        items: {
          create: [
            {
              productId: p1.id,
              productName: p1.name,
              sku: p1.sku,
              description: p1.description,
              quantity: 1,
              unit: "SET",
              unitPrice: 45000,
              gstRate: 18,
              gstAmount: 8100,
              lineTotal: 53100,
            },
            {
              productId: p2.id,
              productName: p2.name,
              sku: p2.sku,
              description: p2.description,
              quantity: 1,
              unit: "NOS",
              unitPrice: 95000,
              gstRate: 18,
              gstAmount: 17100,
              lineTotal: 112100,
            },
          ],
        },
      },
    });

    return NextResponse.json({ success: true, message: "Sample data seeded successfully!" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed sample data" }, { status: 500 });
  }
}
