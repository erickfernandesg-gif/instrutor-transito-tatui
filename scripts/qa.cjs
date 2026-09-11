const { chromium } = require("C:/Users/erick.gonçalves/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"
  });

  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });

  await page.locator("[data-menu-toggle]").click();
  const menuOpen = await page.locator("[data-menu-toggle]").getAttribute("aria-expanded");
  await page.locator("[data-mobile-menu]").getByRole("link", { name: "Como funciona", exact: true }).click();
  const menuClosed = await page.locator("[data-menu-toggle]").getAttribute("aria-expanded");

  await page.locator(".faq__question").nth(1).click();
  const faqOpen = await page.locator(".faq__question").nth(1).getAttribute("aria-expanded");

  await page.locator("#name").fill("Teste");
  await page.locator("#contact-whatsapp").fill("(15) 99999-9999");
  await page.locator("#message").fill("Mensagem de teste");
  await page.getByRole("button", { name: "Continuar no WhatsApp" }).click();
  const status = await page.locator("[data-form-status]").innerText();

  const localAssets = await page.evaluate(() => ({
    brokenImages: [...document.images].filter((image) => !image.complete || image.naturalWidth === 0).length,
    emptyLinks: [...document.querySelectorAll("a[href]")].filter((link) => !link.href || link.href.endsWith("/#")).length
  }));
  const accessibility = await page.evaluate(() => {
    const ids = [...document.querySelectorAll("[id]")].map((element) => element.id);
    return {
      h1Count: document.querySelectorAll("h1").length,
      duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index),
      imagesWithoutAlt: [...document.images].filter((image) => !image.hasAttribute("alt")).length,
      fieldsWithoutLabel: [...document.querySelectorAll("input, textarea, select")].filter((field) => !field.labels?.length).length,
      unnamedButtons: [...document.querySelectorAll("button")].filter((button) => !(button.innerText.trim() || button.getAttribute("aria-label"))).length
    };
  });

  const routeStatuses = {};
  for (const route of ["/", "/politica-de-privacidade/", "/termos-de-uso/", "/robots.txt", "/sitemap.xml", "/manifest.json"]) {
    const response = await page.request.get(`http://127.0.0.1:4173${route}`);
    routeStatuses[route] = response.status();
  }

  const configuredPage = await browser.newPage();
  await configuredPage.route("**/js/config.js", (route) => route.fulfill({
    contentType: "application/javascript",
    body: `window.SITE_CONFIG = {
      businessName: "Teste",
      whatsapp: "5515999999999",
      whatsappMessage: "Olá teste",
      city: "Tatuí",
      state: "SP",
      serviceRegion: "Tatuí/SP",
      vehicle: "Chevrolet Celta",
      credentialStatus: false,
      vehiclePhotos: [],
      analytics: {}
    };`
  }));
  await configuredPage.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  const whatsappHref = await configuredPage.locator("[data-whatsapp]").first().getAttribute("href");

  console.log(JSON.stringify({ menuOpen, menuClosed, faqOpen, status, localAssets, accessibility, routeStatuses, whatsappHref, consoleErrors }, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
