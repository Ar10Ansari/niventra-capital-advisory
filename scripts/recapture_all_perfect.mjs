import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const VERCEL_BASE = "https://niventra-capital-advisory.vercel.app";
const ASSETS_DIR = path.resolve("docs/presentation/assets/website-overview");

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

async function run() {
  console.log("Launching Chrome to capture genuine Step 3, Chatbot conversation, and Head Office...");
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,1000"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 2 });

    // ========================================================================
    // 1. Capture 03c_project_funding_step3.png
    // ========================================================================
    console.log("1. Navigating to /project-funding/ to capture Step 3...");
    await page.goto(`${VERCEL_BASE}/project-funding/`, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 1200));

    // Fill Step 1
    await page.focus("#applicantName");
    await page.type("#applicantName", "Rajendra Singhania");
    await page.focus("#organizationName");
    await page.type("#organizationName", "Singhania Buildcon Pvt. Ltd.");
    await page.focus("#email");
    await page.type("#email", "rajendra@singhaniabuildcon.com");
    await page.focus("#phone");
    await page.type("#phone", "+91 98260 54321");
    await page.focus("#role");
    await page.type("#role", "Managing Director");

    await page.evaluate(() => {
      const cb = document.querySelector("input[name='consentGiven']");
      if (cb && !cb.checked) cb.click();
      const btns = Array.from(document.querySelectorAll("button"));
      const b = btns.find((btn) => btn.textContent && btn.textContent.includes("Proceed to Project Details"));
      if (b) b.click();
    });
    await new Promise((r) => setTimeout(r, 1200));

    // Fill Step 2
    await page.focus("#projectName");
    await page.type("#projectName", "Green Crest Meadows & Towers");
    await page.focus("#address");
    await page.type("#address", "Super Corridor Sector 14");
    await page.focus("#city");
    await page.type("#city", "Indore");
    await page.focus("#pinCode");
    await page.type("#pinCode", "452005");
    await page.focus("#description");
    await page.type("#description", "Twin 18-storey residential towers comprising 216 luxury 3BHK units with RERA sanction.");
    await page.focus("#totalCost");
    await page.type("#totalCost", "4800");
    await page.focus("#fundingRequested");
    await page.type("#fundingRequested", "1600");
    await page.focus("#useOfFunds");
    await page.type("#useOfFunds", "Superstructure civil construction and MEP contractor milestone disbursements.");

    const timelineInput = await page.$("#expectedTimeline");
    if (timelineInput) {
      await page.focus("#expectedTimeline");
      await page.type("#expectedTimeline", "24 Months to handover");
    }

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const b = btns.find((btn) => btn.textContent && btn.textContent.includes("Proceed to Documents"));
      if (b) b.click();
    });
    await new Promise((r) => setTimeout(r, 1200));

    // Scroll to form card
    await page.evaluate(() => {
      const formCard = document.querySelector("#main-content section:nth-of-type(2)");
      if (formCard) formCard.scrollIntoView({ behavior: "instant", block: "start" });
    });
    await new Promise((r) => setTimeout(r, 600));

    const s3Path = path.join(ASSETS_DIR, "03c_project_funding_step3.png");
    await page.screenshot({ path: s3Path });
    console.log("Successfully captured Step 3:", s3Path);

    // ========================================================================
    // 2. Capture 04_chatbot_interaction.png with open conversation
    // ========================================================================
    console.log("2. Navigating to homepage to capture Chatbot interaction...");
    await page.goto(`${VERCEL_BASE}/`, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 1500));

    const chatBtn = await page.$("button[aria-label='Open Niventra Institutional Advisory Assistant']");
    if (chatBtn) {
      await chatBtn.click();
      console.log("Clicked Chatbot button!");
      await new Promise((r) => setTimeout(r, 1000));

      const chatInput = await page.$("input[placeholder*='Ask about']");
      if (chatInput) {
        await chatInput.type("What are the eligibility criteria for real estate project funding?");
        await page.keyboard.press("Enter");
        console.log("Submitted query, waiting 4.5s for grounded response...");
        await new Promise((r) => setTimeout(r, 4500));
      }
    } else {
      console.log("Warning: Chatbot button not found!");
    }

    const s4Path = path.join(ASSETS_DIR, "04_chatbot_interaction.png");
    await page.screenshot({ path: s4Path });
    console.log("Successfully captured full Chatbot screen:", s4Path);

    // Capture Chatbot closeup
    const chatModal = await page.$("div.fixed.bottom-6.right-6 > div");
    if (chatModal) {
      const s4ClosePath = path.join(ASSETS_DIR, "04_chatbot_closeup.png");
      await chatModal.screenshot({ path: s4ClosePath });
      console.log("Successfully captured Chatbot closeup:", s4ClosePath);
    } else {
      // Fallback: capture by selector or bounding box
      const fallbackBox = await page.$("div.fixed.bottom-6.right-6");
      if (fallbackBox) {
        const s4ClosePath = path.join(ASSETS_DIR, "04_chatbot_closeup.png");
        await fallbackBox.screenshot({ path: s4ClosePath });
        console.log("Captured Chatbot closeup from fallbackBox:", s4ClosePath);
      }
    }

    // ========================================================================
    // 3. Capture 06a_branch_directory_head_office.png
    // ========================================================================
    console.log("3. Navigating to /contact/ to capture Branch Directory Head Office...");
    await page.goto(`${VERCEL_BASE}/contact/`, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 1500));

    await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll("h2, h3, div"));
      const target = headings.find((h) => h.textContent && h.textContent.includes("Office Locations & Regional Network"));
      if (target) {
        target.scrollIntoView({ behavior: "instant", block: "start" });
      } else {
        window.scrollTo(0, 1150);
      }
    });
    await new Promise((r) => setTimeout(r, 800));

    const s6aPath = path.join(ASSETS_DIR, "06a_branch_directory_head_office.png");
    await page.screenshot({ path: s6aPath });
    console.log("Successfully captured Branch Head Office:", s6aPath);

  } catch (err) {
    console.error("Error during recapture:", err);
  } finally {
    await browser.close();
    console.log("Recapture process complete.");
  }
}

run();
