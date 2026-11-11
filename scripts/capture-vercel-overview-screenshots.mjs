import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const ASSETS_DIR = path.join(process.cwd(), "docs", "presentation", "assets", "website-overview");
const VERCEL_BASE = "https://niventra-capital-advisory.vercel.app";

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

async function main() {
  console.log("Launching headless Chrome for live Vercel screenshots...");
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
    defaultViewport: { width: 1440, height: 1000, deviceScaleFactor: 2 },
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu", "--font-render-hinting=none"],
  });

  const page = await browser.newPage();

  // Helper to capture a screenshot
  async function capture(url, filename, options = {}) {
    const fullPath = path.join(ASSETS_DIR, filename);
    console.log(`\nNavigating to ${url}...`);
    await page.goto(url, { waitUntil: "load", timeout: 30000 });
    await new Promise((r) => setTimeout(r, options.waitMs || 1500));

    if (options.beforeCapture) {
      await options.beforeCapture(page);
    }

    if (options.scrollSelector) {
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
      }, options.scrollSelector);
      await new Promise((r) => setTimeout(r, 800));
    } else if (options.scrollY) {
      await page.evaluate((y) => window.scrollTo(0, y), options.scrollY);
      await new Promise((r) => setTimeout(r, 800));
    }

    if (options.clipSelector) {
      const el = await page.$(options.clipSelector);
      if (el) {
        await el.screenshot({ path: fullPath });
        console.log(`Saved element clip: ${fullPath}`);
        return;
      }
    }

    await page.screenshot({ path: fullPath, fullPage: options.fullPage || false });
    console.log(`Saved screenshot: ${fullPath}`);
  }

  try {
    // ------------------------------------------------------------------------
    // 1. Slide 1: Homepage Overview
    // ------------------------------------------------------------------------
    await capture(`${VERCEL_BASE}/`, "01_home_overview.png", {
      scrollY: 0,
      waitMs: 1500,
    });

    // ------------------------------------------------------------------------
    // 2. Slide 2: Schedule a Client Meeting / Consultation Panel
    // ------------------------------------------------------------------------
    await capture(`${VERCEL_BASE}/contact/`, "02_schedule_meeting_panel.png", {
      scrollSelector: "form",
      waitMs: 1500,
      beforeCapture: async (p) => {
        // Pre-fill realistic appointment details for clear management presentation
        try {
          await p.type("#fullName", "Vikramaditya Sharma");
          await p.type("#email", "v.sharma@apexcapital.in");
          await p.type("#phoneNumber", "+91 98260 12345");
          await p.select("select[name='category']", "Capital Provider / Investor");
          await p.select("select[name='capitalRange']", "₹1 Crore – ₹5 Crore");
          const msgBox = await p.$("textarea[name='message']");
          if (msgBox) {
            await msgBox.type("Requesting introductory meeting to review Secured Debenture private placement tranches.");
          }
        } catch (e) {
          console.log("Pre-fill note:", e.message);
        }
      },
    });

    // ------------------------------------------------------------------------
    // 3. Slide 3: Project Funding Portal (Multi-step)
    // ------------------------------------------------------------------------
    // Step 1: Developer Credentials
    await capture(`${VERCEL_BASE}/project-funding/`, "03a_project_funding_step1.png", {
      scrollY: 250,
      waitMs: 1500,
    });

    // Step 2: Project Details & Specs
    await capture(`${VERCEL_BASE}/project-funding/`, "03b_project_funding_step2.png", {
      scrollY: 200,
      waitMs: 1000,
      beforeCapture: async (p) => {
        await p.type("#applicantName", "Rajendra Singhania");
        await p.type("#organizationName", "Singhania Buildcon Pvt. Ltd.");
        await p.type("#email", "rajendra@singhaniabuildcon.com");
        await p.type("#phone", "+91 98260 54321");
        await p.type("#role", "Managing Director");
        await p.evaluate(() => {
          const btns = Array.from(document.querySelectorAll("button"));
          const target = btns.find((b) => b.textContent && b.textContent.includes("Proceed to Project Details"));
          if (target) target.click();
        });
        await new Promise((r) => setTimeout(r, 1000));
        await p.type("#projectName", "Green Crest Meadows & Towers");
        await p.type("#address", "Super Corridor Sector 14");
        await p.type("#city", "Indore");
        await p.type("#pinCode", "452005");
        await p.type("#description", "Twin 18-storey residential towers comprising 216 luxury 3BHK units with RERA sanction.");
        await p.type("#totalCost", "4800");
        await p.type("#fundingRequested", "1600");
      },
    });

    // Step 3: Document Verification Checklist
    await capture(`${VERCEL_BASE}/project-funding/`, "03c_project_funding_step3.png", {
      scrollY: 250,
      waitMs: 500,
      beforeCapture: async (p) => {
        await p.evaluate(() => {
          const btns = Array.from(document.querySelectorAll("button"));
          const target = btns.find((b) => b.textContent && b.textContent.includes("Proceed to Documents"));
          if (target) target.click();
        });
        await new Promise((r) => setTimeout(r, 1000));
      },
    });

    // ------------------------------------------------------------------------
    // 4. Slide 4: Website Chatbot
    // ------------------------------------------------------------------------
    await capture(`${VERCEL_BASE}/`, "04_chatbot_interaction.png", {
      waitMs: 1500,
      beforeCapture: async (p) => {
        const chatBtn = await p.$("button[aria-label='Open Institutional Chatbot']");
        if (chatBtn) {
          await chatBtn.click();
          await new Promise((r) => setTimeout(r, 800));
          const input = await p.$("input[placeholder*='Ask about']");
          if (input) {
            await input.type("What are the eligibility criteria for real estate project funding?");
            await p.keyboard.press("Enter");
            await new Promise((r) => setTimeout(r, 3000)); // wait for grounding engine response
          }
        }
      },
    });

    // ------------------------------------------------------------------------
    // 5. Slide 5: Investment Return Calculator
    // ------------------------------------------------------------------------
    await capture(`${VERCEL_BASE}/calculator/`, "05_calculator_interface.png", {
      scrollSelector: "#calculator-container, #main-content section:nth-of-type(2)",
      waitMs: 1500,
      beforeCapture: async (p) => {
        try {
          // Interact with calculator inputs to produce worked example: ₹25,00,000 @ 14.5% for 36M
          const principalInput = await p.$("input[type='number']");
          if (principalInput) {
            await principalInput.click({ clickCount: 3 });
            await principalInput.type("2500000");
          }
          await new Promise((r) => setTimeout(r, 600));

          // Toggle Cash-Flow Schedule open
          await p.evaluate(() => {
            const btns = Array.from(document.querySelectorAll("button"));
            const scheduleBtn = btns.find((b) => b.textContent && b.textContent.includes("View Indicative Cash-Flow Schedule"));
            if (scheduleBtn) scheduleBtn.click();
          });
          await new Promise((r) => setTimeout(r, 800));
        } catch (e) {
          console.log("Calculator interaction note:", e.message);
        }
      },
    });

    // ------------------------------------------------------------------------
    // 6. Slide 6: Branches and Office Locations (All 25 Locations)
    // ------------------------------------------------------------------------
    await capture(`${VERCEL_BASE}/contact/`, "06a_branch_directory_head_office.png", {
      scrollSelector: "#branch-directory",
      waitMs: 1500,
    });

    // Additional capture of regional branch cards grid
    await capture(`${VERCEL_BASE}/contact/`, "06b_branch_directory_grid.png", {
      scrollY: 1050,
      waitMs: 1000,
    });

    // ------------------------------------------------------------------------
    // 7. Slide 7: Investor Portal Entry (Live on Vercel)
    // ------------------------------------------------------------------------
    await capture(`${VERCEL_BASE}/login`, "07_investor_portal_entry.png", {
      scrollY: 0,
      waitMs: 1500,
    });

    console.log("\nAll live Vercel screenshots captured successfully!");
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
