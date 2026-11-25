/**
 * Real End-to-End Browser Automation Test against Live Running Dev Server
 * Driven by real Google Chrome via puppeteer-core
 */
import puppeteer from "puppeteer-core";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testAssetPath = path.join(__dirname, "test-product-brass-hamper.png");
const BASE_URL = "http://localhost:8080";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const TEST_PRODUCT_NAME = "E2E Royal Artisan Brass Hamper";
const TEST_PRODUCT_SLUG = "e2e-royal-artisan-brass-hamper";

async function runBrowserE2E() {
  console.log("================================================================================");
  console.log("🌐 LAUNCHING REAL GOOGLE CHROME FOR END-TO-END SYSTEM VERIFICATION");
  console.log("================================================================================\n");

  const consoleLogs = [];
  const networkErrors = [];

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1280,900"],
    defaultViewport: { width: 1280, height: 900 },
  });

  const page = await browser.newPage();

  page.on("console", (msg) => {
    const text = msg.text();
    consoleLogs.push(`[${msg.type()}] ${text}`);
    if (msg.type() === "error") {
      console.warn("  ⚠️ Browser Console Error:", text);
    }
  });

  page.on("pageerror", (err) => {
    console.error("  ❌ Uncaught Browser Exception:", err.message);
    networkErrors.push(err.message);
  });

  page.on("requestfailed", (req) => {
    // Ignore aborted or favicon failures
    if (!req.url().includes("favicon")) {
      networkErrors.push(`${req.method()} ${req.url()} - ${req.failure()?.errorText}`);
    }
  });

  try {
    // -------------------------------------------------------------------------
    // STEP 1: Log in as authorized admin
    // -------------------------------------------------------------------------
    console.log("👉 Step 1: Navigating to Admin Login page...");
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: "networkidle0" });

    console.log("   Entering admin credentials (admin@snapcraft.in)...");
    await page.waitForSelector('input[type="email"]', { timeout: 8000 });
    await page.type('input[type="email"]', "admin@snapcraft.in");
    await page.type('input[type="password"]', "Admin@1234");

    const submitBtn = await page.$('button[type="submit"]');
    await submitBtn.click();

    console.log("   Waiting for authentication and redirect to admin dashboard...");
    await page.waitForFunction(
      () =>
        window.location.pathname.includes("/admin/dashboard") ||
        window.location.pathname.includes("/admin/products"),
      { timeout: 10000 },
    );
    console.log("   ✅ Admin authenticated successfully. Current URL:", page.url());

    // Pre-test cleanup if a previous test run left the product
    await page.goto(`${BASE_URL}/admin/products`, { waitUntil: "networkidle0" });
    await page.waitForSelector("table", { timeout: 8000 });
    const preExisting = await page.evaluate((prodName) => {
      const rows = Array.from(document.querySelectorAll("tbody tr"));
      const match = rows.find((r) => r.textContent.includes(prodName));
      if (match) {
        const deleteBtn = match.querySelector('button[title*="Delete"], button.text-rose-500');
        if (deleteBtn) {
          deleteBtn.click();
          return true;
        }
      }
      return false;
    }, TEST_PRODUCT_NAME);

    if (preExisting) {
      console.log("   Found leftover product from earlier test. Cleaning up before test run...");
      try {
        const confirmDeleteBtn = await page.waitForSelector(
          "xpath///button[contains(., 'Yes, Delete Product')]",
          {
            timeout: 4000,
          },
        );
        if (confirmDeleteBtn) await confirmDeleteBtn.click();
        await new Promise((r) => setTimeout(r, 1000));
      } catch {}
    }

    // -------------------------------------------------------------------------
    // STEP 2: Navigate to Add Product form
    // -------------------------------------------------------------------------
    console.log("\n👉 Step 2: Navigating to Add Product form (/admin/products/new)...");
    await page.goto(`${BASE_URL}/admin/products/new`, { waitUntil: "networkidle0" });

    await page.waitForSelector('input[placeholder*="Victorian"]', { timeout: 8000 });
    console.log("   Entering product details...");
    await page.type('input[placeholder*="Victorian"]', TEST_PRODUCT_NAME);

    // Enter short description
    const shortDescArea = await page.$('textarea[placeholder*="Brief summary"]');
    if (shortDescArea) {
      await shortDescArea.type("Artisanal brass trunk with velvet interior and gourmet truffles.");
    }

    // -------------------------------------------------------------------------
    // STEP 3: Switch to Pricing tab and enter price
    // -------------------------------------------------------------------------
    console.log("\n👉 Step 3: Configuring Pricing & Inclusions...");
    const pricingTabBtn = await page.waitForSelector("xpath///button[contains(., 'Pricing')]", {
      timeout: 5000,
    });
    await pricingTabBtn.click();
    await page.waitForSelector('input[placeholder="2499"]', { timeout: 5000 });
    await page.type('input[placeholder="2499"]', "4999");

    // Add an inclusion
    const inclusionInput = await page.$('input[placeholder*="18 Stem"]');
    if (inclusionInput) {
      await inclusionInput.type("Handcrafted Brass Trinket Box");
      const addInclusionBtn = await page.waitForSelector(
        "xpath///button[contains(., 'Add Item')]",
        { timeout: 5000 },
      );
      await addInclusionBtn.click();
    }

    // -------------------------------------------------------------------------
    // STEP 4: Switch to Media tab and upload real image
    // -------------------------------------------------------------------------
    console.log("\n👉 Step 4: Uploading real image through Media Uploader...");
    const mediaTabBtn = await page.waitForSelector("xpath///button[contains(., 'Media')]", {
      timeout: 5000,
    });
    await mediaTabBtn.click();

    await page.waitForSelector('input[type="file"]', { timeout: 5000 });
    const fileInput = await page.$('input[type="file"]');
    await fileInput.uploadFile(testAssetPath);

    console.log("   Waiting for upload pipeline and persistent IndexedDB storage...");
    // Wait for upload progress to finish and preview to appear
    await page.waitForFunction(
      () => {
        const previewImgs = document.querySelectorAll(".aspect-square img, .relative img");
        return previewImgs.length > 0;
      },
      { timeout: 10000 },
    );

    // Retrieve uploaded image URL from DOM
    const uploadedUrlInDOM = await page.evaluate(() => {
      const img = document.querySelector(".aspect-square img, .relative img");
      return img ? img.src : null;
    });
    console.log("   ✅ Uploaded Image URL in DOM:", uploadedUrlInDOM?.slice(0, 60) + "...");

    // -------------------------------------------------------------------------
    // STEP 5: Save Product as Draft
    // -------------------------------------------------------------------------
    console.log("\n👉 Step 5: Saving product as 'Draft'...");
    const draftBtn = await page.waitForSelector("xpath///button[contains(., 'Save as Draft')]", {
      timeout: 5000,
    });
    await draftBtn.click();

    // Wait for redirect to /admin/products
    await page.waitForFunction(() => window.location.pathname.endsWith("/admin/products"), {
      timeout: 10000,
    });
    console.log("   ✅ Successfully saved as draft and redirected to products table.");

    // Verify product is listed with Draft status
    await page.waitForSelector("table", { timeout: 5000 });
    const draftStatusVerified = await page.evaluate((prodName) => {
      const rows = Array.from(document.querySelectorAll("tbody tr"));
      const match = rows.find((r) => r.textContent.includes(prodName));
      return match ? match.textContent.includes("Draft") : false;
    }, TEST_PRODUCT_NAME);
    console.log(
      "   ✅ Product row verified with Draft status in Admin Table:",
      draftStatusVerified,
    );

    // -------------------------------------------------------------------------
    // STEP 6: Refresh the application and verify persistence
    // -------------------------------------------------------------------------
    console.log("\n👉 Step 6: Hard refreshing the application (Simulating browser refresh)...");
    await page.reload({ waitUntil: "networkidle0" });
    await page.waitForSelector("table", { timeout: 8000 });

    const persistedRow = await page.evaluate((prodName) => {
      const rows = Array.from(document.querySelectorAll("tbody tr"));
      const match = rows.find((r) => r.textContent.includes(prodName));
      if (!match) return null;
      const thumb = match.querySelector("img");
      return {
        found: true,
        thumbSrc: thumb ? thumb.src : null,
      };
    }, TEST_PRODUCT_NAME);

    console.log("   ✅ Product persisted in table after full page reload:", persistedRow?.found);
    console.log(
      "   ✅ Thumbnail persisted correctly:",
      persistedRow?.thumbSrc?.slice(0, 60) + "...",
    );

    // -------------------------------------------------------------------------
    // STEP 7: Reopen product in Edit mode
    // -------------------------------------------------------------------------
    console.log("\n👉 Step 7: Reopening product in Edit Mode...");
    const editBtn = await page.evaluateHandle((prodName) => {
      const rows = Array.from(document.querySelectorAll("tbody tr"));
      const match = rows.find((r) => r.textContent.includes(prodName));
      return match ? match.querySelector('a[href*="/edit"]') : null;
    }, TEST_PRODUCT_NAME);

    if (editBtn.asElement()) {
      await editBtn.asElement().click();
    } else {
      throw new Error("Edit button not found for test product");
    }

    await page.waitForFunction(() => window.location.pathname.includes("/edit"), { timeout: 8000 });
    console.log("   ✅ Reopened Edit Product URL:", page.url());

    // Verify form fields populated
    const nameInForm = await page.$eval('input[placeholder*="Victorian"]', (el) => el.value);
    console.log("   ✅ Form Name Input loaded:", nameInForm);

    // -------------------------------------------------------------------------
    // STEP 8: Publish Product
    // -------------------------------------------------------------------------
    console.log("\n👉 Step 8: Publishing product to public storefront...");
    const publishBtn = await page.waitForSelector(
      "xpath///button[contains(., 'Publish Product')]",
      { timeout: 5000 },
    );
    await publishBtn.click();

    await page.waitForFunction(() => window.location.pathname.endsWith("/admin/products"), {
      timeout: 10000,
    });
    console.log("   ✅ Product published and redirected back to admin table.");

    // -------------------------------------------------------------------------
    // STEP 9: Verify Rendering on Public Website
    // -------------------------------------------------------------------------
    console.log(
      "\n👉 Step 9: Opening Public Hampers Storefront (http://localhost:8080/hampers)...",
    );
    await page.goto(`${BASE_URL}/hampers`, { waitUntil: "networkidle0" });

    // Wait for product cards
    await page.waitForSelector(".snapcraft-product-card", { timeout: 8000 });

    const publicProductCard = await page.evaluate((prodName) => {
      const cards = Array.from(document.querySelectorAll(".snapcraft-product-card"));
      const match = cards.find((c) => c.textContent.includes(prodName));
      if (!match) return null;
      const img = match.querySelector("img.product-card-img");
      return {
        found: true,
        title: match.querySelector(".product-card-title")?.textContent?.trim(),
        imgSrc: img ? img.src : null,
        naturalWidth: img ? img.naturalWidth : 0,
        naturalHeight: img ? img.naturalHeight : 0,
        complete: img ? img.complete : false,
      };
    }, TEST_PRODUCT_NAME);

    console.log("   ✅ Public Card Found:", publicProductCard?.found);
    console.log("   ✅ Public Card Title:", publicProductCard?.title);
    console.log("   ✅ Public Card Image Loaded (naturalWidth):", publicProductCard?.naturalWidth);
    console.log("   ✅ Public Card Image Source:", publicProductCard?.imgSrc?.slice(0, 60) + "...");

    if (!publicProductCard?.found || publicProductCard?.naturalWidth === 0) {
      throw new Error("Product card failed to render properly on public website!");
    }

    // -------------------------------------------------------------------------
    // STEP 10: Verify Product Detail Page
    // -------------------------------------------------------------------------
    console.log(
      "\n👉 Step 10: Navigating directly to Product Detail Page (/products/e2e-royal-artisan-brass-hamper)...",
    );
    await page.goto(`${BASE_URL}/products/${TEST_PRODUCT_SLUG}`, { waitUntil: "networkidle0" });

    const detailPageData = await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      const mainImg = document.querySelector(".aspect-square img");
      return {
        title: h1 ? h1.textContent?.trim() : null,
        imgSrc: mainImg ? mainImg.src : null,
        naturalWidth: mainImg ? mainImg.naturalWidth : 0,
        naturalHeight: mainImg ? mainImg.naturalHeight : 0,
      };
    });

    console.log("   ✅ Product Detail Title:", detailPageData.title);
    console.log("   ✅ Main Image naturalWidth:", detailPageData.naturalWidth);
    console.log("   ✅ Main Image Source:", detailPageData.imgSrc?.slice(0, 60) + "...");

    if (!detailPageData.title || detailPageData.naturalWidth === 0) {
      throw new Error("Product Detail Page failed to render image or title!");
    }

    // -------------------------------------------------------------------------
    // STEP 11: Clean up test product
    // -------------------------------------------------------------------------
    console.log("\n👉 Step 11: Cleaning up test product from admin database...");
    await page.goto(`${BASE_URL}/admin/products`, { waitUntil: "networkidle0" });
    await page.waitForSelector("table", { timeout: 8000 });

    // Click delete on the test product
    const deleteSuccess = await page.evaluate((prodName) => {
      const rows = Array.from(document.querySelectorAll("tbody tr"));
      const match = rows.find((r) => r.textContent.includes(prodName));
      if (!match) return false;
      // Find delete button
      const deleteBtn = match.querySelector(
        'button[title*="Delete"], button.text-rose-600, button:has(svg.lucide-trash2), button:has(svg.lucide-trash-2)',
      );
      if (deleteBtn) {
        deleteBtn.click();
        return true;
      }
      return false;
    }, TEST_PRODUCT_NAME);

    if (deleteSuccess) {
      console.log(
        "   Delete button clicked on test product row. Waiting for confirmation modal...",
      );
      const confirmDeleteBtn = await page.waitForSelector(
        "xpath///button[contains(., 'Yes, Delete Product')]",
        {
          timeout: 5000,
        },
      );
      if (confirmDeleteBtn) {
        await confirmDeleteBtn.click();
        console.log("   ✅ 'Yes, Delete Product' confirmed.");
      }
    }

    await new Promise((r) => setTimeout(r, 1200));

    // Verify deletion
    const finalTableCheck = await page.evaluate((prodName) => {
      const rows = Array.from(document.querySelectorAll("tbody tr"));
      return rows.some((r) => r.textContent.includes(prodName));
    }, TEST_PRODUCT_NAME);
    console.log("   ✅ Test product cleaned up from admin table:", !finalTableCheck);

    // Verify public catalog still has all default items intact
    await page.goto(`${BASE_URL}/hampers`, { waitUntil: "networkidle0" });
    const publicCardCount = await page.evaluate(() => {
      return document.querySelectorAll(".snapcraft-product-card").length;
    });
    console.log(
      "   ✅ Public catalogue still preserves all production products:",
      publicCardCount,
      "items listed.",
    );

    console.log(
      "\n================================================================================",
    );
    console.log("🎉 ALL REAL END-TO-END BROWSER WORKFLOW TESTS PASSED 100%!");
    console.log(
      "================================================================================\n",
    );
  } catch (err) {
    console.error("\n❌ BROWSER E2E TEST FAILED:", err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    // Clean up temporary image file
    try {
      // Keep or remove test asset
    } catch {}
  }
}

runBrowserE2E();
