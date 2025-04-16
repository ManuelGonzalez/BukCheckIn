const puppeteer = require("puppeteer");

async function marcarEnBuk(user, sentido) {
  const URL_LOGIN = "https://23people.buk.cl/users/sign_in";
  const URL_PORTAL = "https://23people.buk.cl/static_pages/portal";

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  try {
    await page.goto(URL_LOGIN, { waitUntil: "networkidle2" });
    await page.type("#user_email", user.email);
    await page.type("#user_password", user.password);
    await Promise.all([
      page.click("input[name='commit']"),
      page.waitForNavigation({ waitUntil: "networkidle2" }),
    ]);

    await page.goto(URL_PORTAL, { waitUntil: "networkidle2" });

    await page.evaluate((sentido) => {
      const boton = document.querySelector(`a[data-sentido='\${sentido}']`);
      if (boton) boton.click();
    }, sentido);

    await page.waitForTimeout(3000);
  } finally {
    await browser.close();
  }
}

module.exports = { marcarEnBuk };