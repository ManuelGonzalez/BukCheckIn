const puppeteer = require("puppeteer");

async function marcarEnBuk(user, sentido) {
  const URL_LOGIN = "https://23people.buk.cl/users/sign_in";
  const URL_PORTAL = "https://23people.buk.cl/static_pages/portal";

  console.log(`🔐 Iniciando proceso de marcaje para ${user.nombre} - Sentido: ${sentido}`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  try {
    console.log("🌐 Navegando al login de Buk...");
    await page.goto(URL_LOGIN, { waitUntil: "networkidle2" });

    console.log("✍️ Escribiendo credenciales...");
    await page.type("#user_email", user.email);
    await page.type("#user_password", user.password);

    console.log("🔓 Iniciando sesión...");
    await Promise.all([
      page.click("input[name='commit']"),
      page.waitForNavigation({ waitUntil: "networkidle2" }),
    ]);

    console.log("📄 Navegando al portal del colaborador...");
    await page.goto(URL_PORTAL, { waitUntil: "networkidle2" });

    console.log(`🖱️ Intentando hacer clic en el botón de ${sentido}...`);
    await page.evaluate((sentido) => {
      const boton = document.querySelector(`a[data-sentido='${sentido}']`);
      if (boton) {
        console.log("✅ Botón encontrado, haciendo clic...");
        boton.click();
      } else {
        console.log("❌ Botón no encontrado");
      }
    }, sentido);

    console.log("⏳ Esperando confirmación...");
    await page.waitForTimeout(3000);

    console.log(`✅ Proceso de marcaje completado para ${user.nombre} - ${sentido}`);
  } catch (error) {
    console.error(`❌ Error durante el marcaje para ${user.nombre} - ${sentido}:`, error);
    throw error;
  } finally {
    console.log("🧹 Cerrando navegador...");
    await browser.close();
  }
}

module.exports = { marcarEnBuk };