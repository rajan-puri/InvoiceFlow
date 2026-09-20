import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const email = "demo@invoiceflow.io";
  const passwordHash = await bcrypt.hash("DemoPassword123!", 10);

  // Upsert demo user
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Rajan Puri",
      companyName: "InvoiceFlow Technologies Pvt Ltd",
      passwordHash,
      phone: "+91 98765 43210",
      address: "DLF Cyber City, Tower 10, Sector 24, Gurugram, Haryana - 122002",
      gstin: "07AAAAA1234A1Z5",
      currencySymbol: "₹",
      role: "admin",
      isEmailVerified: true,
    },
  });

  console.log(`Demo user created: ${user.email}`);

  // Create products
  const productsData = [
    {
      userId: user.id,
      name: "Enterprise Cloud ERP Platform",
      sku: "ERP-ENT-01",
      description: "Annual subscription for multi-entity ERP, billing & inventory suite",
      price: 85000,
      gstRate: 18,
      unit: "YR",
      category: "Software",
    },
    {
      userId: user.id,
      name: "Custom API Integration Service",
      sku: "SRV-INT-02",
      description: "Dedicated developer sprint for payment gateway & CRM webhooks",
      price: 45000,
      gstRate: 18,
      unit: "NOS",
      category: "Professional Services",
    },
    {
      userId: user.id,
      name: "High-Performance Dedicated Server",
      sku: "HW-SRV-03",
      description: "Intel Xeon 32-core, 128GB ECC RAM, 2TB NVMe rackmount server",
      price: 185000,
      gstRate: 18,
      unit: "NOS",
      category: "Hardware",
    },
  ];

  for (const prod of productsData) {
    await prisma.product.create({ data: prod });
  }

  // Create clients
  const client1 = await prisma.client.create({
    data: {
      userId: user.id,
      companyName: "Horizon Media Dynamics Ltd",
      contactPerson: "Aditi Rao",
      email: "accounts@horizonmedia.in",
      phone: "+91 98200 44556",
      billingAddress: "402, Lotus Grandeur, Veera Desai Road, Andheri West, Mumbai, MH - 400053",
      shippingAddress: "402, Lotus Grandeur, Veera Desai Road, Andheri West, Mumbai, MH - 400053",
      gstin: "27AAACH1234P1Z2",
    },
  });

  const client2 = await prisma.client.create({
    data: {
      userId: user.id,
      companyName: "Apex Logistics India Pvt Ltd",
      contactPerson: "Kunal Verma",
      email: "kunal@apexlogistics.com",
      phone: "+91 99887 66554",
      billingAddress: "Plot 45, Udyog Vihar Phase 4, Gurugram, HR - 122015",
      shippingAddress: "Warehouse 2A, Bilaspur Logistic Park, NH-8, Gurugram - 122413",
      gstin: "06AAACA9876Q1Z9",
    },
  });

  // Create initial Proforma Invoice
  const subtotal = 85000 + 45000;
  const discountAmount = 5000; // flat discount
  const taxableAmount = subtotal - discountAmount;
  const gstAmount = (taxableAmount * 18) / 100;
  const grandTotal = taxableAmount + gstAmount;

  await prisma.invoice.create({
    data: {
      userId: user.id,
      invoiceNumber: "PI-2026-001",
      issueDate: new Date(),
      validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: "SENT",
      clientId: client1.id,
      clientCompanyName: client1.companyName,
      clientContactPerson: client1.contactPerson,
      clientEmail: client1.email,
      clientPhone: client1.phone,
      clientBillingAddress: client1.billingAddress,
      clientShippingAddress: client1.shippingAddress,
      clientGstin: client1.gstin,
      subtotal,
      discountType: "FIXED",
      discountValue: 5000,
      discountAmount,
      gstAmount,
      grandTotal,
      notes: "Proforma invoice valid for 15 days. Kindly wire 50% advance for immediate onboarding.",
      terms: "1. All disputes subject to local jurisdiction.\n2. Taxes as applicable per Govt GST rules.",
      items: {
        create: [
          {
            productName: "Enterprise Cloud ERP Platform",
            sku: "ERP-ENT-01",
            description: "Annual subscription for multi-entity ERP, billing & inventory suite",
            quantity: 1,
            unit: "YR",
            unitPrice: 85000,
            gstRate: 18,
            gstAmount: 15300,
            lineTotal: 100300,
          },
          {
            productName: "Custom API Integration Service",
            sku: "SRV-INT-02",
            description: "Dedicated developer sprint for payment gateway & CRM webhooks",
            quantity: 1,
            unit: "NOS",
            unitPrice: 45000,
            gstRate: 18,
            gstAmount: 8100,
            lineTotal: 53100,
          },
        ],
      },
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
