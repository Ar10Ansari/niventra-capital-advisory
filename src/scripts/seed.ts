import { db } from "../lib/db";
import { hashPassword } from "../lib/auth/password";

console.log("Seeding local development database with explicitly labelled test data...");

// 1. Create Default Users if not exist
const users = [
  {
    id: "usr_admin_dev",
    name: "System Administrator",
    email: "admin@niventra.local",
    password: "NiventraAdmin2026!",
    role: "ADMIN",
    phone: "+91 98765 00001",
  },
  {
    id: "usr_staff_dev",
    name: "Advisory Desk Operator",
    email: "staff@niventra.local",
    password: "NiventraStaff2026!",
    role: "STAFF",
    phone: "+91 98765 00002",
  },
  {
    id: "usr_investor_dev",
    name: "Vikramaditya Sharma",
    email: "investor@example.com",
    password: "Investor2026!",
    role: "INVESTOR",
    phone: "+91 98765 00003",
  },
];

for (const u of users) {
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(u.email);
  if (!existing) {
    const { hash, salt } = hashPassword(u.password);
    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, salt, role, phone, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
    `).run(u.id, u.name, u.email, hash, salt, u.role, u.phone);
    console.log(`Created test user: ${u.email} (${u.role})`);
  }
}

// 2. Seed Sample Products
const products = [
  {
    id: "prod_ncd_tranche_a",
    slug: "secured-ncd-tranche-a",
    title: "Secured Real Estate Debenture Tranche A",
    category: "DEBENTURE",
    indicativeYield: "14.5% p.a.*",
    tenor: "36 Months",
    minInvestment: "₹10,00,000",
    securityType: "First Pari-Passu Charge on Commercial Assets (CHG-9)",
    summary: "Senior secured non-convertible debenture backed by prime commercial assets with quarterly coupon distribution.",
    description: "Tranche A debentures are issued pursuant to Section 42 of the Companies Act, 2013 on a private placement basis. Capital is deployed into vetted commercial property developments with verified RERA approvals.",
    risksSummary: "Subject to obligor credit risk, real estate absorption velocity, and liquidity lock-in. Tax deducted at source where applicable.",
  },
  {
    id: "prod_redevelopment_series_1",
    slug: "redevelopment-debt-series-1",
    title: "Urban Redevelopment Debt Series 1",
    category: "REAL_ESTATE_DEBT",
    indicativeYield: "15.0% p.a.*",
    tenor: "24 Months",
    minInvestment: "₹25,00,000",
    securityType: "Escrow Cash-Flow Waterfall + Mortgage Charge",
    summary: "Targeted project debt supporting brownfield residential redevelopment in high-density tier-1 corridors.",
    description: "Structured project finance tranche featuring milestone-linked capital releases strictly verified by third-party civil engineering monitors.",
    risksSummary: "Construction timeline risks, municipal approval delays, and micro-market pricing pressures.",
  },
];

for (const p of products) {
  const existing = db.prepare("SELECT id FROM products WHERE slug = ?").get(p.slug);
  if (!existing) {
    db.prepare(`
      INSERT INTO products (
        id, slug, title, category, indicative_yield, tenor, min_investment,
        security_type, status, summary, description, risks_summary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PUBLISHED', ?, ?, ?)
    `).run(
      p.id, p.slug, p.title, p.category, p.indicativeYield, p.tenor,
      p.minInvestment, p.securityType, p.summary, p.description, p.risksSummary
    );
    console.log(`Created product: ${p.title}`);
  }
}

// 3. Seed Sample Documents
const documents = [
  {
    id: "doc_corporate_profile",
    title: "Niventra Corporate Profile & Advisory Standards",
    docType: "POLICY",
    filePath: "storage/documents/doc_corporate_profile.pdf",
    fileSize: 412000,
    mimeType: "application/pdf",
    isPublic: 1,
  },
  {
    id: "doc_pas4_sample",
    title: "Private Placement Offer Letter (PAS-4) Reference Format",
    docType: "OFFER_DOC",
    filePath: "storage/documents/doc_pas4_sample.pdf",
    fileSize: 854000,
    mimeType: "application/pdf",
    isPublic: 0,
  },
  {
    id: "doc_termsheet_sample",
    title: "Sample Debenture Term Sheet & Security Covenants",
    docType: "TERM_SHEET",
    filePath: "storage/documents/doc_termsheet_sample.pdf",
    fileSize: 320000,
    mimeType: "application/pdf",
    isPublic: 0,
  },
];

for (const d of documents) {
  const existing = db.prepare("SELECT id FROM documents WHERE id = ?").get(d.id);
  if (!existing) {
    db.prepare(`
      INSERT INTO documents (
        id, title, doc_type, file_path, file_size, mime_type, version, is_public, status
      ) VALUES (?, ?, ?, ?, ?, ?, '1.0', ?, 'APPROVED')
    `).run(d.id, d.title, d.docType, d.filePath, d.fileSize, d.mimeType, d.isPublic);
    console.log(`Created document record: ${d.title}`);
  }
}

// 4. Seed Initial Sample Enquiry
const sampleEnquiry = db.prepare("SELECT id FROM enquiries WHERE id = 'ENQ-2026-0001'").get();
if (!sampleEnquiry) {
  db.prepare(`
    INSERT INTO enquiries (
      id, user_id, full_name, email, phone_number, category,
      capital_range, message, consent, status, internal_notes
    ) VALUES (
      'ENQ-2026-0001', 'usr_investor_dev', 'Vikramaditya Sharma', 'investor@example.com',
      '+91 98765 00003', 'Capital Provider / Investor', '₹25 Lakh – ₹1 Crore',
      'Interested in learning more about secured NCD Tranche A coupon frequencies and ROC charge creation.',
      1, 'IN_REVIEW', 'Preliminary suitability verified. Follow-up scheduled.'
    )
  `).run();
  console.log("Created sample enquiry: ENQ-2026-0001");
}

console.log("Local development database seeded successfully.");
